import morgan from "morgan";

export function logger() {
  const format =
    ":method :url :status - :response-time ms from [:remote-addr] at (:date[web])";
  return morgan(format);
}
