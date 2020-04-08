const ctx: Worker = self as any;

console.log("starting worker");
// Respond to message from parent thread
ctx.onmessage = (ev) => {
  console.log("worker");
};
