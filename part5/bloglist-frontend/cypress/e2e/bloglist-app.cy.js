describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:3000')
  })
  it('Login is shown', function () {
    cy.get('.loginForm').should('be.visible').parent().contains('log in')
  })

  describe('Login', function () {
    const user = {
      username: 'username',
      name: 'name',
      password: 'password',
    }
    beforeEach(function () {
      cy.request('POST', 'http://localhost:3003/api/testing/createUser', user)
    })

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

      // logout
      cy.contains('Logout').click()
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
})
