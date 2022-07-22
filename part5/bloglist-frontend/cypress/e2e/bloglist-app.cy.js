describe('Blog app', function () {
  const user = {
    username: 'username',
    name: 'name',
    password: 'password',
  }

  const blog = {
    title: 'blogTitle',
    author: 'blogAuthor',
    url: 'blogUrl'
  }

  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.createUser(user)
    cy.intercept('GET', 'http://localhost:3000/api/blogs').as('loadBlogs')
    cy.visit('http://localhost:3000')
    cy.wait('@loadBlogs')
  })

  it('Login is shown', function () {
    cy.get('.loginForm').should('be.visible').parent().contains('log in')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password)
      cy.get('.loginForm input[type=\'submit\']').click()
      cy.contains('Login success') // notification
      cy.get('.loginForm').should('not.be.visible')

      cy.contains('blogs') // title
      cy.window().then(window => {
        let userData = window.localStorage.getItem('user')
        expect(userData).to.be.a('string')
        userData = JSON.parse(userData)
        expect(userData.name).to.be.equal(user.name)
        expect(userData.username).to.be.equal(user.username)
        expect(userData.token).to.be.a('string')
      })

      cy.reload()
      cy.contains('blogs')

      // logout
      cy.contains('Logout').click()
      cy.get('.loginForm').should('be.visible')

      cy.reload()
      cy.get('.loginForm').should('be.visible')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password + 'abc')
      cy.get('.loginForm input[type=\'submit\']').click()
      cy.contains('Cannot login') // notification
        .should('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('.loginForm').should('be.visible')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login(user)
      cy.wait('@loadBlogs')
    })

    it('A blog can be created', function () {
      cy.contains('blog')
      cy.get('.blogForm').should('not.be.visible')
      cy.contains('create new blog').click()
      cy.get('.blogForm #title').type(blog.title)
      cy.get('.blogForm #author').type(blog.author)
      cy.get('.blogForm #url').type(blog.url)
      cy.get('.blogForm input[type=\'submit\']').click()

      cy.contains(/A new blog.*added/) // notification
        .within(() => {
          cy.contains(blog.title)
          cy.contains(blog.author)
        })

      cy.get(`.blogItem:contains(${blog.title})`).as('blogItem')
        .within(() => {
          cy.contains(blog.title)
          cy.contains(blog.author)
          cy.get('.blogItemDetail').should('not.be.visible')
          cy.contains('show').click()
          cy.get('.blogItemDetail').should('be.visible')
        })

      cy.reload()
      cy.wait('@loadBlogs')
      cy.get('@blogItem')
        .contains(blog.title)
        .contains(blog.author)
    })

    it('Can like a blog', function () {
      cy.createBlog(blog)
      cy.reload()
      cy.wait('@loadBlogs')
      let oldLikes = (blog.likes == null) ? 0 : blog.likes

      // need to show details in order to like a blog
      cy.get(`.blogItem:contains('${blog.title}')`)
        .as('blogItem')
        .within(() => {
          cy.contains(/likes.*\d+/).should('not.be.visible')
          cy.get('button.likeBlog').should('not.be.visible')
          cy.contains('show').click()
          cy.get('button.likeBlog').should('be.visible')
        })

      const extractLikes = (elem) => {
        const digits = elem.text().match(/(\d+)/)[1]
        return parseInt(digits)
      }

      cy.get('@blogItem')
        .then(extractLikes)
        .should(likes => expect(likes).to.equal(oldLikes))

      // Trying to click the button
      cy.intercept({ method: 'PUT', url: 'http://localhost:3000/api/blogs/**' }).as('updateBlog')
      cy.get('@blogItem')
        .get('button.likeBlog').contains('like').click()
      cy.wait('@updateBlog')

      // likes is increased
      cy.get('@blogItem')
        .then(extractLikes)
        .should(likes => expect(likes).to.equal(oldLikes + 1))

      cy.reload()
      cy.wait('@loadBlogs')
      cy.get('@blogItem')
        .contains('show').click()
      cy.get('@blogItem')
        .then(extractLikes)
        .should(likes => expect(likes).to.equal(oldLikes + 1))
    })
  })
})
