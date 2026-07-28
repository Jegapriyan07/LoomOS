/**
 * OTP delivery providers.
 *
 * Default: DevOtpProvider (code on screen + server log).
 * Production: set MSG91_* or TWILIO_* in .env → real SMS, never return code to client.
 */

export type OtpDeliveryResult = {
  /** When true, SMS was not sent; code may be returned to the client for demos */
  isDev: boolean;
  /** Only set by DevOtpProvider — never return plaintext OTP when SMS is live */
  devCode?: string;
};

export interface OtpDelivery {
  send(phone: string, code: string): Promise<OtpDeliveryResult>;
}

/** Dev / Demo — no SMS. Code returned in API + logged. */
export class DevOtpProvider implements OtpDelivery {
  async send(phone: string, code: string): Promise<OtpDeliveryResult> {
    console.info(`[DevOtpProvider] OTP for ${phone}: ${code}`);
    return { isDev: true, devCode: code };
  }
}

/**
 * MSG91 Flow / template SMS (India).
 *
 * Env:
 *   MSG91_AUTHKEY      — dashboard auth key
 *   MSG91_TEMPLATE_ID  — approved DLT/flow template id (or MSG91_FLOW_ID)
 *   MSG91_SENDER       — optional 6-char sender id
 *   MSG91_OTP_VAR      — template variable name for the code (default VAR1)
 *
 * Template example: "Your LoomOS code is ##VAR1##. Valid 10 minutes."
 * We still verify OTP in our DB — MSG91 only delivers the SMS.
 */
export class Msg91OtpProvider implements OtpDelivery {
  async send(phone: string, code: string): Promise<OtpDeliveryResult> {
    const authkey = process.env.MSG91_AUTHKEY?.trim();
    const templateId =
      process.env.MSG91_TEMPLATE_ID?.trim() ||
      process.env.MSG91_FLOW_ID?.trim();
    const sender = process.env.MSG91_SENDER?.trim();
    const varName = process.env.MSG91_OTP_VAR?.trim() || "VAR1";

    if (!authkey || !templateId) {
      throw new Error(
        "MSG91_AUTHKEY and MSG91_TEMPLATE_ID (or MSG91_FLOW_ID) are required",
      );
    }

    const mobiles = `91${phone}`;
    const recipient: Record<string, string> = {
      mobiles,
      [varName]: code,
    };

    const body: Record<string, unknown> = {
      template_id: templateId,
      recipients: [recipient],
    };
    // Some MSG91 accounts use flow_id instead of template_id
    if (process.env.MSG91_FLOW_ID?.trim()) {
      body.flow_id = process.env.MSG91_FLOW_ID.trim();
      delete body.template_id;
    }
    if (sender) body.sender = sender;

    const res = await fetch("https://control.msg91.com/api/v5/flow/", {
      method: "POST",
      headers: {
        authkey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = (await res.json().catch(() => ({}))) as {
      type?: string;
      message?: string;
    };

    if (!res.ok || (data.type && data.type !== "success")) {
      console.error("[Msg91OtpProvider] send failed", res.status, data);
      throw new Error(
        data.message || `MSG91 SMS failed (HTTP ${res.status})`,
      );
    }

    console.info(`[Msg91OtpProvider] OTP SMS queued for ${mobiles}`);
    return { isDev: false };
  }
}

/**
 * Twilio Programmable SMS (international fallback).
 *
 * Env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER
 */
export class TwilioOtpProvider implements OtpDelivery {
  async send(phone: string, code: string): Promise<OtpDeliveryResult> {
    const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
    const token = process.env.TWILIO_AUTH_TOKEN?.trim();
    const from = process.env.TWILIO_FROM_NUMBER?.trim();

    if (!sid || !token || !from) {
      throw new Error(
        "TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER are required",
      );
    }

    const to = `+91${phone}`;
    const auth = Buffer.from(`${sid}:${token}`).toString("base64");
    const params = new URLSearchParams({
      To: to,
      From: from,
      Body: `Your LoomOS sign-in code is ${code}. Valid for 10 minutes.`,
    });

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      },
    );

    const data = (await res.json().catch(() => ({}))) as {
      sid?: string;
      message?: string;
      error_message?: string;
    };

    if (!res.ok) {
      console.error("[TwilioOtpProvider] send failed", res.status, data);
      throw new Error(
        data.error_message || data.message || `Twilio SMS failed (HTTP ${res.status})`,
      );
    }

    console.info(`[TwilioOtpProvider] OTP SMS queued for ${to}`);
    return { isDev: false };
  }
}

/** @deprecated Use Msg91OtpProvider or TwilioOtpProvider */
export class SmsOtpProvider extends Msg91OtpProvider {}

/**
 * Pick provider from env.
 * Prefer MSG91 (India), then Twilio, else Dev OTP.
 */
export function getOtpDelivery(): OtpDelivery {
  if (
    process.env.MSG91_AUTHKEY?.trim() &&
    (process.env.MSG91_TEMPLATE_ID?.trim() ||
      process.env.MSG91_FLOW_ID?.trim())
  ) {
    return new Msg91OtpProvider();
  }
  if (
    process.env.TWILIO_ACCOUNT_SID?.trim() &&
    process.env.TWILIO_AUTH_TOKEN?.trim() &&
    process.env.TWILIO_FROM_NUMBER?.trim()
  ) {
    return new TwilioOtpProvider();
  }
  return new DevOtpProvider();
}

export function isSmsProviderConfigured(): boolean {
  return !(getOtpDelivery() instanceof DevOtpProvider);
}
