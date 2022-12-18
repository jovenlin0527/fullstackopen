const extractNumber = (elem) => {
  const digits = elem.text().match(/(\d+)/)[1]
  return parseInt(digits)
}

const sampleUser = {
  username: 'username',
  name: 'John Doe',
  password: 'password',
}

const sampleBlog = {
  title: 'blogTitle',
  author: 'blogAuthor',
  url: 'blogUrl',
  likes: 0,
}

beforeEach(function () {
  cy.request('POST', 'http://localhost:3003/api/testing/reset')
  cy.createUser(sampleUser)
  cy.intercept('GET', 'http://localhost:3000/api/blogs').as('loadBlogs')
  cy.intercept('GET', 'http://localhost:3000/api/users').as('loadUsers')
})

describe('Navigation bar', function () {
  it('exists on various pages', function () {
    function assertNavigationBarExists() {
      cy.get('[data-testid="navigationBar"]')
    }
    cy.visit('http://localhost:3000')
    assertNavigationBarExists()
    cy.visit('http://localhost:3000/users')
    assertNavigationBarExists()
  })

  describe('its content', function () {
    beforeEach(function () {
      cy.visit('http://localhost:3000')
    })

    it('has links to bloglist and users', function () {
      cy.get('[data-testid="navigationBar"]')
        .get('a')
        .within(() => {
          cy.contains('blogs').then((result) => {
            expect(result.length).to.be.equal(1)
            expect(result[0].href).to.be.equal('http://localhost:3000/')
          })
          cy.contains('users').then((result) => {
            expect(result.length).to.be.equal(1)
            expect(result[0].href).to.be.equal('http://localhost:3000/users')
          })
        })
    })

    it('contains login from', function () {
      cy.get('[data-testid="navigationBar"]').get('[data-testid="loginForm"]')
    })
  })
})

describe('Login test', function () {
  beforeEach(function () {
    cy.intercept('POST', 'http://localhost:3000/api/login').as('loginRequest')
    cy.visit('http://localhost:3000')
    cy.wait('@loadBlogs')
  })

  it('Login is shown', function () {
    cy.get('[data-testid="loginForm"]')
      .should('be.visible')
      .get('form')
      .within(() => {
        cy.get('#username')
        cy.get('#password')
        cy.get('input[type="submit"]')
      })
  })

  describe('if succeeds', function () {
    beforeEach(function () {
      cy.get('[data-testid="loginForm"]').within(() => {
        cy.get('#username').type(sampleUser.username)
        cy.get('#password').type(sampleUser.password)
        cy.get("input[type='submit']").click()
        cy.wait('@loginRequest')
      })
    })

    it('responds with HTTP200', function () {
      cy.get('@loginRequest').its('response.statusCode').should('be.equal', 200)
    })

    it('sends notification', function () {
      cy.get('[data-testid="notificationItem"]').contains('Login success')
      cy.get('[data-testid="notificationItem"]', { timeout: 10000 }).should(
        'not.exist'
      )
    })

    it('updates local storage', function () {
      cy.window().then((window) => {
        let userData = window.localStorage.getItem('user')
        expect(userData).to.be.a('string')
        userData = JSON.parse(userData)
        expect(userData.name).to.be.equal(sampleUser.name)
        expect(userData.username).to.be.equal(sampleUser.username)
        expect(userData.token).to.be.a('string')
      })
    })

    it('login form is replaced', function () {
      cy.get('[data-testid="loginForm"]').should('not.exist')
      // the status line
      cy.contains('logged in').contains(sampleUser.name)
      cy.contains('Logout')
    })

    describe('logging out', function () {
      beforeEach(function () {
        cy.contains('Logout').click()
      })

      it('shows login form again', function () {
        cy.get('[data-testid="loginForm"]')
      })

      it('local storage is cleared', function () {
        cy.window().then((window) => {
          let userData = window.localStorage.getItem('user')
          expect(userData).to.be.null
        })
      })
    })
  })

  describe('fails with wrong credentials', function () {
    beforeEach(function () {
      cy.get('[data-testid="loginForm"]').within(() => {
        cy.get('#username').type(sampleUser.username)
        cy.get('#password').type(sampleUser.password + 'abc')
        cy.get("input[type='submit']").click()
      })
    })

    it('notifies the user that login failed', function () {
      cy.get('[data-testid="notificationItem"]')
        .contains('Cannot login')
        .should('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('[data-testid="notificationItem"]', { timeout: 10000 }).should(
        'not.exist'
      )
    })

    it('still shows the login form', function () {
      cy.get('[data-testid="loginForm"]').should('be.visible')
    })
  })
})

describe('test index page', function () {
  beforeEach(function () {
    cy.login(sampleUser)
    cy.createBlog(sampleBlog).then(({ id: blogId }) => {
      expect(blogId).not.be.null
      cy.wrap(blogId).as('blogId')
    })
    cy.visit('http://localhost:3000')
    cy.wait('@loadBlogs')
  })

  it('A blog can be created', function () {
    const newBlog = {
      title: 'newTitle',
      author: 'newAuthor',
      url: 'https://newUrl/',
    }
    cy.contains('blog')
    cy.get('.blogForm').should('not.be.visible')
    cy.contains('create new blog').click()
    cy.get('.blogForm #title').type(newBlog.title)
    cy.get('.blogForm #author').type(newBlog.author)
    cy.get('.blogForm #url').type(newBlog.url)
    cy.get(".blogForm input[type='submit']").click()

    cy.get('[data-testid="notificationItem"]').within(function () {
      cy.contains(newBlog.title)
      cy.contains(newBlog.author)
    })

    cy.contains(newBlog.title)
    cy.get('[data-testid="notificationItem"]', { timeout: 10000 }).should(
      'not.exist'
    )

    cy.reload()
    cy.wait('@loadBlogs')
    cy.contains(newBlog.title)
  })

  describe('Click a blog to see the details', function () {
    it('Clicking a blog shows the detail', function () {
      cy.contains(sampleBlog.title).should('be.visible').click()

      cy.contains(sampleBlog.title)
      cy.contains(sampleBlog.url)
      cy.contains(sampleBlog.author)
      cy.contains('likes').contains(sampleBlog.likes)
      cy.contains('added').contains(sampleUser.name)
    })

    it('Clicking a book leads to the details page via client side routing', function () {
      cy.url().as('oldUrl')
      cy.window().then((win) => (win.shouldNotReload = true))

      cy.contains(sampleBlog.title).click()

      cy.url().then((newUrl) => {
        cy.get('@blogId').then((blogId) => expect(newUrl).contains(blogId))
        cy.get('@oldUrl').then((oldUrl) => expect(oldUrl).not.eq(newUrl))
      })

      cy.window().should('have.prop', 'shouldNotReload')
    })
  })

  it('blog is sorted by likes', function () {
    const likes = [9, 5, 6, 1, 13]
    const blogs = [sampleBlog]
    for (let i = 0; i < 5; i++) {
      const newBlog = {
        ...sampleBlog,
        title: sampleBlog.title + i.toString(),
        likes: likes[i],
      }
      blogs.push(newBlog)
      cy.createBlog(newBlog)
    }
    cy.reload()
    cy.wait('@loadBlogs')

    let oldLikes = Infinity
    cy.get('[data-testid="blogItem"]')
      .as('blogList')
      .each((elem) => {
        cy.wrap(elem)
          .contains(/blogTitle(\d*)/)
          .then((component) => {
            const text = component[0].textContent
            const title = text.match(/blogTitle\d*/)[0]
            const b = blogs.find((b) => b.title === title)
            const likes = b.likes
            expect(likes).lte(oldLikes)
            oldLikes = likes
          })
      })
  })
})

describe('On blog details', function () {
  beforeEach(function () {
    cy.login(sampleUser)
    cy.createBlog(sampleBlog).then(({ id: blogId }) => {
      expect(blogId).not.be.null
      cy.wrap(blogId).as('blogId')
      cy.visit(`http://localhost:3000/blogs/${blogId}`)
      cy.wait('@loadBlogs')
    })
  })

  it('Shows the detail', function () {
    // intentinally duplicated with 'Click a blog to see the details',
    // because this one tests the content of a specific url.
    cy.contains(sampleBlog.title)
    cy.contains(sampleBlog.url)
    cy.contains(sampleBlog.author)
    cy.contains('likes').contains(sampleBlog.likes)
    cy.contains('added').contains(sampleUser.name)
  })

  it('Can like a blog', function () {
    let oldLikes = sampleBlog.likes

    cy.contains('likes')
      .then(extractNumber)
      .should((likes) => expect(likes).to.equal(oldLikes))

    // Trying to click the button
    cy.intercept({
      method: 'PUT',
      url: 'http://localhost:3000/api/blogs/**',
    }).as('updateBlog')
    cy.get('button.likeBlog').contains('like').click()
    cy.wait('@updateBlog')

    // likes is increased
    cy.contains('likes')
      .then(extractNumber)
      .should((likes) => expect(likes).to.equal(oldLikes + 1))
  })

  describe('Delete a blog', function () {
    describe('as the owner', function () {
      beforeEach(function () {
        cy.intercept({
          method: 'DELETE',
          url: 'http://localhost:3000/api/blogs/**',
        }).as('deleteBlog')

        // prepare for testing client-side routing
        cy.url().as('blogViewUrl')
        cy.window().then((win) => (win.shouldNotReload = true))

        cy.on('window:confirm', (text) => {
          expect(text).to.have.string('Remove')
          expect(text).to.have.string(sampleBlog.title)
          expect(text).to.have.string(sampleBlog.author)
        })
        cy.contains('remove').click()

        cy.wait('@deleteBlog')
      })

      it('succeeds', function () {
        cy.get('@blogViewUrl').then((url) => {
          const blogId = url.match(/\/([0-9a-f]+)$/)[1]
          cy.wrap(blogId).as('blogId')
        })
        cy.get('@blogId').then((blogId) => {
          cy.request({
            url: `http://localhost:3000/api/blogs/${blogId}`,
            failOnStatusCode: false,
          })
            .its('status')
            .should('equal', 404)
        })
      })

      it('redirects to the homepage', function () {
        // client side routing succeeds
        cy.url().should('be.equal', 'http://localhost:3000/')
        cy.window().should('have.prop', 'shouldNotReload')
        // Wait for notification to disappear
        // This is required because the title also appears in the notification
        cy.contains(sampleBlog.title, { timeout: 10000 }).should('not.exist')
      })

      it('shows notification', function () {
        cy.get('[data-testid="notificationItem"]')
          .as('notification')
          .contains(new RegExp(`Removed.*${sampleBlog.title}`))
          .should('be.visible')

        // wait for notification to disappear
        cy.get('@notification', { timeout: 10000 }).should('not.exist')
      })
    })

    it('Do not show "remove" button if you are not the owner', function () {
      const newUser = {
        username: 'anotherUser',
        name: 'anotherName',
        password: 'password',
      }
      cy.createUser(newUser)
      cy.login(newUser)
      cy.reload()
      cy.wait('@loadBlogs')
      cy.get(`.blogItem:contains('${sampleBlog.title}')`).within(function () {
        cy.contains('remove').should('not.exist')
      })
    })
  })
})

describe('test user view', function () {
  const anotherSampleBlog = {
    title: 'anotherBlog',
    author: 'anotherAuthor',
    url: 'anotherUrl',
  }

  const userWithNoBlog = {
    username: 'foo',
    name: 'Foo Bar',
    password: 'cool',
  }

  beforeEach(function () {
    cy.createUser(userWithNoBlog)
    cy.login(sampleUser)
    cy.createBlog(sampleBlog)
    cy.createBlog(anotherSampleBlog)
    cy.visit('http://localhost:3000/users')
    cy.wait('@loadUsers')
  })

  it('Lists all users and blog count', function () {
    cy.contains('Users') // page title

    cy.get('table tr').within(function () {
      cy.contains('th', sampleUser.name).siblings().contains('2')
      cy.contains('th', userWithNoBlog.name).siblings().contains('0')
    })
  })

  it('Click the user to see the details', function () {
    cy.contains('a', sampleUser.name).click()

    cy.contains(sampleBlog.title)
    cy.contains(anotherSampleBlog.title)
  })

  it('Click the user changes the url via client side routing', function () {
    cy.url().as('oldUrl')

    // https://stackoverflow.com/a/67720310
    cy.window().then((win) => {
      win.shouldNotReload = true
    })
    cy.contains('a', sampleUser.name).click()
    cy.window().should('have.prop', 'shouldNotReload')

    cy.url().then((url) => {
      cy.get('@oldUrl').then((oldUrl) => {
        expect(url).not.eq(oldUrl)
      })
    })
  })

  it('reloading on a user detail page still displays the detail', function () {
    cy.contains('a', sampleUser.name).click()
    cy.url().as('oldUrl')
    cy.get('@oldUrl').then(cy.visit)

    cy.contains(sampleBlog.title)
    cy.contains(anotherSampleBlog.title)
  })
})
