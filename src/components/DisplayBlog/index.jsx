import React from "react";
import "./index.scss";
import { Markup } from "interweave";
import { Skeleton } from "antd";

function DisplayBlog({ titleBlog, cateBlog, contentBlog, loading = false }) {
  return (
    <div className="displayBlog__container">
      <div className="displayBlog__container__title">
        {loading ? (
          <Skeleton.Button
            active={true}
            size="large"
            shape="square"
            block={true}
          />
        ) : (
          <span>{titleBlog}</span>
        )}
      </div>
      <div className="displayBlog__container__cate">
        {titleBlog || contentBlog ? (
          <div className="displayBlog__container__cate__button">
            <img src={cateBlog?.Icon} alt="" />
            <span>{cateBlog?.Label}</span>
          </div>
        ) : null}
      </div>
      <div className="displayBlog__container__content">
        <div className="ck-content">
          {loading ? (
            <>
              {["", "", ""].map((item, index) => (
                <Skeleton key={index} />
              ))}
            </>
          ) : (
            <Markup content={contentBlog} />
          )}
        </div>
      </div>
    </div>
  );
}

export default DisplayBlog;
