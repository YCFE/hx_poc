exports.context = (function () {
  const requireContext = function () {
    throw new Error('noop')
  };

  requireContext.keys = function () {
    return [];
  }

  requireContext.resolve = function (req) {
    return (function() { throw new Error("Cannot find module '" + req + "'.") }());
  }

  requireContext.id = undefined;

  return requireContext;
})();