export interface Env {
  DESTINATION_EMAIL: string;
}

export interface ForwardableEmailMessage {
  readonly from: string;
  readonly to: string;
  readonly headers: Headers;
  readonly raw: ReadableStream;
  readonly rawSize: number;
  setReject(reason: string): void;
  forward(rcptTo: string, headers?: Headers): Promise<void>;
  reply(message: any): Promise<void>;
}

export default {
  async email(
    message: ForwardableEmailMessage,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    const from = message.from;
    const to = message.to;
    const subject = message.headers.get("subject") || "(Sans objet)";
    const targetEmail = env.DESTINATION_EMAIL || "victoriareindale@gmail.com";

    console.log(`[EmailWorker] Incoming message from: ${from} to: ${to}`);
    console.log(`[EmailWorker] Subject: ${subject}`);
    console.log(`[EmailWorker] Forwarding to: ${targetEmail}`);

    try {
      // Forward the full email and all original attachments to Victoria's personal Gmail
      await message.forward(targetEmail);
      console.log(`[EmailWorker] Successfully forwarded message to ${targetEmail}`);
    } catch (error) {
      console.error(`[EmailWorker] Failed to forward email to ${targetEmail}:`, error);
      // In case of forwarding failure, throw so Cloudflare handles retry/diagnostics
      throw error;
    }
  },
};
