import React, { useContext, useState } from "react";
import classnames from "classnames";
import { HistoryTokenContext } from "../../contexts/HistoryTokenContext";
import {
  PromotedIcon,
  TrendingIcon,
  EyeIcon,
  HeartIcon,
  HeartSolidIcon,
  HistoryIcon,
} from "../icons/index";

import styles from "./index.module.scss";

function TokenExplore({ isSmall }: { isSmall?: Boolean }) {
  const [tabActive, setTabActive] = useState("history");
  const { historyTokens, handleSetFavourite } = useContext(HistoryTokenContext)

  return (
    <div className={styles.wrapper}>
      {/* <h3>Token Explorer</h3> */}
      {/* <span>Explore Trending, Promoted and Hot Tokens quickly with the token explorer.</span> */}
      <div className="flex mt-1 justify-content-space-between">
        <div className="explore-type flex">
          {/* <div 
            onClick={() => setTabActive("promoted")}
            className={classnames("explore-type__item", { 'is-active': tabActive === "promoted" })}
          >
            <PromotedIcon /> Promoted
          </div>
          <div 
            onClick={() => setTabActive("trending")}
            className={classnames("explore-type__item", { 'is-active': tabActive === "trending" })}
          >
            <TrendingIcon /> Trending
          </div>
          <div 
            onClick={() => setTabActive("most_viewed")}
            className={classnames("explore-type__item", { 'is-active': tabActive === "most_viewed" })}
          >
            <EyeIcon /> Most Viewed
          </div> */}
          {/* <div 
            onClick={() => setTabActive("favourited")}
            className={classnames("explore-type__item", { 'is-active': tabActive === "favourited" })}
          >
            <HeartSolidIcon /> Favourited
          </div> */}
          <div
            onClick={() => setTabActive("history")}
            className={classnames("explore-type__item", {
              "is-active": tabActive === "history",
            })}
          >
            <HistoryIcon /> History
          </div>
        </div>
      </div>
      <div className="table-content mt-1">
        <table>
          <thead>
            <tr>
              <th className="token-name">Token</th>
              {!isSmall ? (
                <>
                  <th className="token-price">Price</th>
                  <th className="token-market-cap">Market Cap</th>
                  <th className="token-watcher">Watcher</th>
                </>
              ) : null}
              <th className="token-action"></th>
            </tr>
          </thead>
          <tbody>
            {
              historyTokens.map((token: any) => (
                <tr key={token.address}>
                  <td className="token-name">
                    <div className="pointer" onClick={() => window.location.href = `/token/${token.address}`}>
                      <b>{ token.symbol }</b>
                      <br />
                      <span>{ token.name }</span>
                    </div>
                  </td>
                  {!isSmall ? (
                    <>
                      <td className="token-price">$0.002112159573</td>
                      <td className="token-market-cap">$21,121,596</td>
                      <td className="token-watcher">12,000,000</td>
                    </>
                  ) : null}
                  <td className="token-action" style={{ textAlign: "right" }}>
                    <span className="pointer" onClick={() => handleSetFavourite(token)}>
                      {
                        token.is_favourite
                          ? <HeartSolidIcon fill={"#ff6a6a"} />
                          : <HeartIcon />
                      }
                    </span>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TokenExplore;
