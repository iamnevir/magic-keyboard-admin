import SingletonRouter, { Router } from "next/router";
import { useEffect } from "react";

export function usePreventUserFromErasingContent(shouldPreventLeaving: any) {
  const stringToDisplay = "Do you want to save before leaving the page ?";

  useEffect(() => {
    if (!SingletonRouter.router?.change) {
      return;
    }
    // Prevents tab quit / tab refresh
    if (shouldPreventLeaving) {
      // Adding window alert if the shop quits without saving
      window.onbeforeunload = function () {
        return stringToDisplay;
      };
    } else {
      window.onbeforeunload = () => {};
    }

    if (shouldPreventLeaving) {
      // Prevents next routing
      SingletonRouter.router.change = (...args: any) => {
        if (confirm(stringToDisplay)) {
          return Router.prototype.change.apply(SingletonRouter.router, args);
        } else {
          return new Promise((resolve, reject) => resolve(false));
        }
      };
    }
    return () => {
      delete SingletonRouter.router?.change;
    };
  }, [shouldPreventLeaving]);
}
