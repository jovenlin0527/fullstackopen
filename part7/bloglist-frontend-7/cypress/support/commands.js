// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('createUser', (userInfo) => {
  cy.request('POST', 'http://localhost:3003/api/testing/createUser', userInfo)
})

Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('Post', 'http://localhost:3003/api/login', {
    username,
    password,
  }).then(({ body }) => {
    localStorage.setItem('user', JSON.stringify(body))
  })
  cy.reload()
})

Cypress.Commands.add('createBlog', (blog) => {
  const userInfo = localStorage.getItem('user')
  if (userInfo == null) {
    throw new Error('You need to login in order to create a blog!')
  }
  const { token } = JSON.parse(userInfo)
  let newBlog
  cy.request({
    url: 'http://localhost:3003/api/blogs',
    method: 'POST',
    auth: {
      bearer: token,
    },
    body: blog,
  }).then(({ body }) => (newBlog = body))
  return newBlog
})
