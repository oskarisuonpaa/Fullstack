describe("Blog app", function () {
  beforeEach(function () {
    cy.visit("http://localhost:3000");
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user1 = {
      name: "Test",
      username: "Test",
      password: "Test",
    };
    const user2 = {
      name: "Test2",
      username: "Test2",
      password: "Test2",
    };
    cy.request("POST", "http://localhost:3003/api/users", user1);
    cy.request("POST", "http://localhost:3003/api/users", user2);
  });

  it("Login form is shown", function () {
    cy.get(".loginForm").should("be.visible");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("Test");
      cy.get("#password").type("Test");
      cy.get("#login-button").click();
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("fail");
      cy.get("#password").type("fail");
      cy.get("#login-button").click();

      cy.get(".error")
        .and("have.css", "color")
        .should("equal", "rgb(255, 0, 0)");
    });

    describe("When logged in", function () {
      beforeEach(function () {
        cy.get("#username").type("Test");
        cy.get("#password").type("Test");
        cy.get("#login-button").click();
      });

      it("a blog can be created", function () {
        cy.get("#title").type("Test title");
        cy.get("#author").type("Test author");
        cy.get("#url").type("Test url");
        cy.get("#create-button").click();
        cy.contains("Test title");
      });

      describe("And a blog exists", function () {
        beforeEach(function () {
          cy.get("#title").type("Another test title");
          cy.get("#author").type("Another test author");
          cy.get("#url").type("Another test url");
          cy.get("#create-button").click();
          cy.contains("Another test title").contains("view").click();
        });

        it("it can be liked", function () {
          cy.get("#like-button").click();
          cy.get("#likes").contains("likes 1");
        });

        it("it can be deleted by creator", function () {
          cy.wait(1000);
          cy.get("#delete-button").click();
          cy.contains("Another test title").should("not.exist");
        });

        it("it cannot be deleted by another user", function () {
          cy.get("#logout-button").click();
          cy.get("#username").type("Test2");
          cy.get("#password").type("Test2");
          cy.get("#login-button").click();

          cy.get("#delete-button").should("not.exist");
        });

        it("It should be displayed in right order", function () {
          cy.get("#title").type("Another another test title");
          cy.get("#author").type("Another another test author");
          cy.get("#url").type("Another another test url");
          cy.get("#create-button").click();
          cy.wait(4000);
          cy.contains("Another another test title").contains("view").click();
          cy.get(":nth-child(2) > .detailed > #likes > #like-button").click();

          cy.get(".blog").eq(0).should("contain", "Another another test title");
          cy.get(".blog").eq(1).should("contain", "Another test title");
        });
      });
    });
  });
});
