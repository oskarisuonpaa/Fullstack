import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("blog", () => {
  const blog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 0,
    user: "Marsalkka",
  };

  const mockLikeHandler = jest.fn();
  const mockDeleteHandler = jest.fn();

  let container;
  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        handleLike={mockLikeHandler}
        handleDelete={mockDeleteHandler}
      />
    ).container;
  });

  test("initially renders title and author, but doesn't render url or likes", () => {
    const simpleBlog = container.querySelector(".simple");
    const detailedBlog = container.querySelector(".detailed");

    expect(simpleBlog).toBeVisible();
    expect(simpleBlog).toHaveTextContent(`${blog.title} ${blog.author}`);

    expect(detailedBlog).not.toBeVisible();
  });

  test("renders url and likes when toggled by button", async () => {
    const user = userEvent.setup();

    const simpleBlog = container.querySelector(".simple");
    const detailedBlog = container.querySelector(".detailed");

    const viewButton = simpleBlog.querySelector("#view-button");
    await user.click(viewButton);

    expect(simpleBlog).not.toBeVisible();
    expect(detailedBlog).toBeVisible();

    expect(detailedBlog.querySelector("#url")).toBeVisible();
    expect(detailedBlog.querySelector("#likes")).toBeVisible();
  });

  test("renders correct number of likes after liked twice", async () => {
    const user = userEvent.setup();

    const detailedBlog = container.querySelector(".detailed");

    const likeButton = detailedBlog.querySelector("#like-button");
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockLikeHandler).toHaveBeenCalledTimes(2);
  });
});
