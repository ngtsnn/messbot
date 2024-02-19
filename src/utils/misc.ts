import { Logger } from "@nestjs/common";

interface ResLog {
  request: string;
  method: string;
  payload: any;
  from: number;
  to: number;
  data: any;
}
const SLOW_RESPONSE = 500;
export const logWithResTime = (res: ResLog) => {
  const range = res.to - res.from;
  const isFast = range < SLOW_RESPONSE;

  const status = isFast ? "🟢" : "🟡";
  const msg = `
    Response: ${res.method} - ${res.request}
    Payload: ${JSON.stringify(res.payload)}
    From: ${res.from}
    To: ${res.to}
    Time taken: ${status} ${range}ms
    Data: ${JSON.stringify(res.data)}
  `;
  isFast ? Logger.log(msg) : Logger.warn(msg);
  return msg;
};

export const wait = (time: number) => new Promise((res) => setTimeout(res, time));
