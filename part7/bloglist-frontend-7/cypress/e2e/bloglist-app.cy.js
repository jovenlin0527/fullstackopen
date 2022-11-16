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
})

describe('test index page', function () {
  const extractLikes = (elem) => {
    const digits = elem.text().match(/(\d+)/)[1]
    return parseInt(digits)
  }

  beforeEach(function () {
    cy.createUser(sampleUser)
    cy.intercept('GET', 'http://localhost:3000/api/blogs').as('loadBlogs')
    cy.visit('http://localhost:3000')
    cy.wait('@loadBlogs')
  })

  describe('Login', function () {

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

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login(sampleUser)
      cy.wait('@loadBlogs')
    })

    it('A blog can be created', function () {
      cy.contains('blog')
      cy.get('.blogForm').should('not.be.visible')
      cy.contains('create new blog').click()
      cy.get('.blogForm #title').type(sampleBlog.title)
      cy.get('.blogForm #author').type(sampleBlog.author)
      cy.get('.blogForm #url').type(sampleBlog.url)
      cy.get(".blogForm input[type='submit']").click()

      cy.get('[data-testid="notificationItem"]').within(() => {
        cy.contains(sampleBlog.title)
        cy.contains(sampleBlog.author)
      })

      cy.get(`.blogItem:contains(${sampleBlog.title})`)
        .as('blogItem')
        .within(() => {
          cy.contains(sampleBlog.title)
          cy.contains(sampleBlog.author)
          cy.get('.blogItemDetail').should('not.be.visible')
          cy.contains('show').click()
          cy.get('.blogItemDetail').should('be.visible')
        })
      cy.get('[data-testid="notificationItem"]', { timeout: 10000 }).should(
        'not.exist'
      )

      cy.reload()
      cy.wait('@loadBlogs')
      cy.get('@blogItem').contains(sampleBlog.title).contains(sampleBlog.author)
    })

    it('Can like a blog', function () {
      cy.createBlog(sampleBlog)
      cy.reload()
      cy.wait('@loadBlogs')
      let oldLikes = sampleBlog.likes == null ? 0 : sampleBlog.likes

      // need to show details in order to like a blog
      cy.get(`.blogItem:contains('${sampleBlog.title}')`)
        .as('blogItem')
        .within(() => {
          cy.contains(/likes.*\d+/).should('not.be.visible')
          cy.get('button.likeBlog').should('not.be.visible')
          cy.contains('show').click()
          cy.get('button.likeBlog').should('be.visible')
        })

      cy.get('@blogItem')
        .then(extractLikes)
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
        .then(extractLikes)
        .should((likes) => expect(likes).to.equal(oldLikes + 1))

      cy.reload()
      cy.wait('@loadBlogs')
      cy.get('@blogItem').contains('show').click()
      cy.get('@blogItem')
        .then(extractLikes)
        .should((likes) => expect(likes).to.equal(oldLikes + 1))
    })
  })

  describe('Delete a blog', function () {
    beforeEach(() => {
      cy.login(sampleUser)
      cy.createBlog(sampleBlog)
      cy.wait('@loadBlogs')
    })

    it('succeeds if you are the owner', function () {
      cy.intercept({
        method: 'DELETE',
        url: 'http://localhost:3000/api/blogs/**',
      }).as('deleteBlog')
      cy.get(`.blogItem:contains('${sampleBlog.title}')`)
        .as('blogItem')
        .within(() => {
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
      cy.wait('@loadBlogs')
      cy.get(`.blogItem:contains('${sampleBlog.title}')`).within(() => {
        cy.contains('remove').should('not.exist')
        cy.contains('show').click()
        cy.contains('remove').should('not.exist')
      })
    })
  })

  it('blog is sorted by likes', function () {
    cy.login(sampleUser)
    const blogNums = 5
    const blogs = new Array(blogNums)
    for (let i = 0; i < 5; i++) {
      const newBlog = {
        ...sampleBlog,
        title: sampleBlog.title + i.toString(),
        likes: i * i,
      }
      blogs[i] = newBlog
      cy.createBlog(newBlog)
    }
    blogs.sort((x, y) => y.likes - x.likes)
    cy.wait('@loadBlogs')
    cy.reload()
    cy.wait('@loadBlogs')
    const likes = new Array(5)
    cy.get('.blogItem')
      .as('blogList')
      .each((val, idx) => {
        expect(val).to.contain(blogs[idx].title)
      })
    console.log(likes)
    expect(
      likes.every(
        (val, idx) => idx + 1 === likes.length || val < likes[idx + 1]
      )
    )
  })
})

describe.only('test user view', function () {
  beforeEach(function () {
    cy.createUser(sampleUser)
    cy.intercept('GET', 'http://localhost:3000/api/users').as('loadUsers')
    cy.visit('http://localhost:3000/users')
    cy.wait('@loadUsers')
  })

  it('nice display', function() {
    cy.contains('Users')
    cy.contains(sampleUser.name)
  })
})
