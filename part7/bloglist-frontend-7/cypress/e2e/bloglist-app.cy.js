const extractNumber = (elem) => {
  const digits = elem.text().match(/(\d+)/)[1]
  return parseInt(digits)
}

const sampleUser = {
  username: 'username',
  name: 'name',
  password: 'password',
}

const sampleBlog = {
  title: 'blogTitle',
  author: 'blogAuthor',
  url: 'blogUrl',
}

beforeEach(function () {
  cy.request('POST', 'http://localhost:3003/api/testing/reset')
  cy.createUser(sampleUser)
  cy.intercept('GET', 'http://localhost:3000/api/blogs').as('loadBlogs')
  cy.intercept('GET', 'http://localhost:3000/api/users').as('loadUsers')
})

describe('Login test', function () {
  beforeEach(function () {
    cy.visit('http://localhost:3000')
    cy.wait('@loadBlogs')
  })

  it('Login is shown', function () {
    cy.get('.loginForm').should('be.visible').parent().contains('log in')
  })

  it('succeeds with correct credentials', function () {
    cy.get('#username').type(sampleUser.username)
    cy.get('#password').type(sampleUser.password)
    cy.get(".loginForm input[type='submit']").click()
    cy.get('[data-testid="notificationItem"]').contains('Login success')
    cy.get('.loginForm').should('not.be.visible')
    cy.get('[data-testid="notificationItem"]', { timeout: 10000 }).should(
      'not.exist'
    )

    cy.contains('blogs') // title
    cy.window().then((window) => {
      let userData = window.localStorage.getItem('user')
      expect(userData).to.be.a('string')
      userData = JSON.parse(userData)
      expect(userData.name).to.be.equal(sampleUser.name)
      expect(userData.username).to.be.equal(sampleUser.username)
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
    cy.get('#username').type(sampleUser.username)
    cy.get('#password').type(sampleUser.password + 'abc')
    cy.get(".loginForm input[type='submit']").click()
    cy.get('[data-testid="notificationItem"]')
      .contains('Cannot login')
      .should('have.css', 'color', 'rgb(255, 0, 0)')
    cy.get('.loginForm').should('be.visible')
    cy.get('[data-testid="notificationItem"]', { timeout: 10000 }).should(
      'not.exist'
    )
  })

})

describe('test index page', function () {

  beforeEach(function () {
    cy.login(sampleUser)
    cy.createBlog(sampleBlog)
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

    cy.get(`.blogItem:contains(${newBlog.title})`)
      .as('blogItem')
      .within(function () {
        cy.contains(newBlog.title)
        cy.contains(newBlog.author)
        cy.get('.blogItemDetail').should('not.be.visible')
        cy.contains('show').click()
        cy.get('.blogItemDetail').should('be.visible')
      })
    cy.get('[data-testid="notificationItem"]', { timeout: 10000 }).should(
      'not.exist'
    )

    cy.reload()
    cy.wait('@loadBlogs')
    cy.get('@blogItem').contains(newBlog.title).contains(newBlog.author)
  })

  it('Can like a blog', function () {
    let oldLikes = sampleBlog.likes == null ? 0 : sampleBlog.likes

    // need to show details in order to like a blog
    cy.get(`.blogItem:contains('${sampleBlog.title}')`)
      .as('blogItem')
      .within(function () {
        cy.contains(/likes.*\d+/).should('not.be.visible')
        cy.get('button.likeBlog').should('not.be.visible')
        cy.contains('show').click()
        cy.get('button.likeBlog').should('be.visible')
      })

    cy.get('@blogItem')
      .then(extractNumber)
      .should((likes) => expect(likes).to.equal(oldLikes))

    // Trying to click the button
    cy.intercept({
      method: 'PUT',
      url: 'http://localhost:3000/api/blogs/**',
    }).as('updateBlog')
    cy.get('@blogItem').get('button.likeBlog').contains('like').click()
    cy.wait('@updateBlog')

    // likes is increased
    cy.get('@blogItem')
      .then(extractNumber)
      .should((likes) => expect(likes).to.equal(oldLikes + 1))
  })

  describe('Delete a blog', function () {
    it('succeeds if you are the owner', function () {
      cy.intercept({
        method: 'DELETE',
        url: 'http://localhost:3000/api/blogs/**',
      }).as('deleteBlog')
      cy.get(`.blogItem:contains('${sampleBlog.title}')`)
        .as('blogItem')
        .within(function () {
          cy.contains('remove').should('not.be.visible')
          cy.contains('show').click()
          cy.on('window:confirm', (text) => {
            expect(text).to.have.string('Remove')
            expect(text).to.have.string(sampleBlog.title)
            expect(text).to.have.string(sampleBlog.author)
          })
          cy.contains('remove').click()
        })
      cy.wait('@deleteBlog')
      cy.get('[data-testid="notificationItem"]').contains(
        new RegExp(`Removed.*${sampleBlog.title}`)
      )
      cy.get('@blogItem').should('not.exist')
      cy.reload()
      cy.wait('@loadBlogs')
      cy.get('@blogItem').should('not.exist')
      cy.get('[data-testid="notificationItem"]', { timeout: 10000 }).should(
        'not.exist'
      )
    })

    it('fails if you are not the owner', function () {
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
        cy.contains('show').click()
        cy.contains('remove').should('not.exist')
      })
    })
  })

  it('blog is sorted by likes', function () {
    const likes = [9, 5, 6, 1, 13]
    for (let i = 0; i < 5; i++) {
      const newBlog = {
        ...sampleBlog,
        title: sampleBlog.title + i.toString(),
        likes: likes[i],
      }
      cy.createBlog(newBlog)
    }
    cy.reload()
    cy.wait('@loadBlogs')
    let oldLike = Infinity
    cy.get('.blogItem')
      .as('blogList')
      .each((elem) => {
        cy.wrap(elem)
          .contains(/[Ll]ikes/)
          .then((likeElem) => {
            const like = extractNumber(likeElem)
            expect(like).be.most(oldLike)
            oldLike = like
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
      password: 'cool'
  }

  beforeEach(function () {
    cy.createUser(userWithNoBlog)
    cy.login(sampleUser)
    cy.createBlog(sampleBlog)
    cy.createBlog(anotherSampleBlog)
    cy.visit('http://localhost:3000/users')
    cy.wait('@loadUsers')
  })

  it('Lists all users and blog count', function() {
    cy.contains('Users') // page title

    cy.get('table tr')
      .within(function () {
        cy.contains('th', sampleUser.name)
          .siblings().contains('2')
        cy.contains('th', userWithNoBlog.name)
          .siblings().contains('0')
      })
  })

  it('Click the user to see the details', function () {
    cy.contains('a', sampleUser.name)
      .click()

    cy.contains(sampleBlog.title)
    cy.contains(anotherSampleBlog.title)
  })

  it('Click the user changes the url via client side routing', function () {
    cy.url().as('oldUrl')

    // https://stackoverflow.com/a/67720310
    cy.window().then((win) => { win.shouldNotReload = true })
    cy.contains('a', sampleUser.name)
      .click()
    cy.window().should('have.prop', 'shouldNotReload')

    cy.url().then((url) => {
      cy.get('@oldUrl').then((oldUrl) => {
        expect(url).not.eq(oldUrl)
      })
    })
  })

  it('reloading on a user detail page still displays the detail', function () {
    cy.contains('a', sampleUser.name)
      .click()
    cy.url().as('oldUrl')
    cy.get('@oldUrl').then(cy.visit)

    cy.contains(sampleBlog.title)
    cy.contains(anotherSampleBlog.title)
  })
})
