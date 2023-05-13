import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

describe("blogForm", () => {
  const blog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
  };

  const mockCreateBlog = jest.fn();

  let container;
  beforeEach(() => {
    container = render(<BlogForm createBlog={mockCreateBlog} />).container;
  });

  test("should submit with right details", async () => {
    const inputTitle = container.querySelector("#title");
    const inputAuthor = container.querySelector("#author");
    const inputUrl = container.querySelector("#url");
    const buttonSubmit = container.querySelector("#create-button");

    const user = userEvent.setup();

    await user.type(inputTitle, blog.title);
    await user.type(inputAuthor, blog.author);
    await user.type(inputUrl, blog.url);
    await user.click(buttonSubmit);

    expect(mockCreateBlog.mock.calls).toHaveLength(1);
    expect(mockCreateBlog.mock.calls[0][0]).toEqual(blog);
  });
});
