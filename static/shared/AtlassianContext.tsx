import React, { ReactElement, useEffect, useState } from "react";
import { getContext } from "@forge/bridge/out/view/getContext";
import { SkeletonItem } from "@atlaskit/menu";

export const AtlassianContext = React.createContext<AtlassianContextType>({
  loading: true,
  forgeContext: null,
});
type AtlassianContextType = {
  loading: boolean;
  forgeContext: ForgeContext | null;
};
type ForgeContext = any; // untyped by atlassian and different in different contexts

/**
 * retrieves forgeContext to provide it within every child that is wrapped by <AtlassianContextProvider> by using
 * const ctx = useContext(AtlassianContext);
 */
export const AtlassianContextProvider = ({
  children,
}: {
  children: ReactElement | ((params: AtlassianContextType) => ReactElement);
}) => {
  const [forgeContext, setForgeContext] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const forgeContext = (await getContext()) as ForgeContext;
        setForgeContext(forgeContext);
        console.log({ forgeContext });
      } catch (e) {
        console.warn(
          "AtlassianContextProvider could not get context information. Some features might not work correctly."
        );
        console.warn(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <>
        {[1, 2].map((_) => (
          <SkeletonItem
            key={_}
            isShimmering
            cssFn={(css) => ({
              padding: 0,
              "min-height": "30px",
              "border-radius": "0",
            })}
          />
        ))}
      </>
    );
  }

  return (
    <AtlassianContext.Provider value={{ loading, forgeContext }}>
      {typeof children === "function"
        ? children({
            loading,
            forgeContext,
          })
        : children}
    </AtlassianContext.Provider>
  );
};
