// ======================================================
// ASYNC ERROR HANDLER WRAPPER
// ======================================================

export const catchAsyncErrors = (fn) => {

  return (req, res, next) => {

    // ======================================================
    // WRAP PROMISE AND FORWARD ERRORS TO EXPRESS
    // ======================================================

    Promise
      .resolve(fn(req, res, next))
      .catch(next);
  };

};