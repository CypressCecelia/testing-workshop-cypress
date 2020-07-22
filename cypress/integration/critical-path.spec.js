/// <reference types="cypress" />

describe('ToDoMVC', () => {
  beforeEach('reset todos and visit site', () => {
    cy.request('POST', '/reset', {
      todos: []
    })
    cy.visit('/')
  })

  it('loads page elements', () => {
    // Use cy.contains() - No assertion needed

    cy.contains('todos')

    // Use a class selector

    cy.get('.new-todo').should(
      'have.attr',
      'placeholder',
      'What needs to be done?'
    )

    // Use custom command with data attribute

    cy.getBySel('show-all').should('not.exist')
  })

  it('adds todos', () => {
    // Adds todo manually

    cy.get('.new-todo').type('Make slides for JS Marathon talk{enter}')

    // Adds todo with a custom command

    cy.createTodo('Write tests')

    // Adds todo via app state

    cy.window()
      .its('app.$store')
      .invoke('dispatch', 'setNewTodo', 'Practice')

    cy.window()
      .its('app.$store')
      .invoke('dispatch', 'addTodo')

    // Assert that todos were added to list

    cy.contains('Make slides for JS Marathon talk')
    cy.contains('Write tests')
    cy.contains('Practice')
  })

  it('toggles completion for a todo', () => {
    // Adds todo

    cy.createTodo('Write tests')

    // Confirms todo was created

    cy.contains('Write tests')

    // Toggle completed manually

    cy.get('.toggle')
      .first()
      .check()

    // Confirm todo was marked completed

    cy.get('.todo')
      .first()
      .should('have.class', 'completed')

    // Toggle completed with custom command

    cy.toggleFirstTodo()

    cy.get('.todo')
      .first()
      .should('not.have.class', 'completed')
  })

  it('deletes a todo', () => {
    // Creates todo with custom command

    cy.createTodo('Write tests')

    // Toggles completed with custom command

    cy.toggleFirstTodo()

    // Click delete button
    cy.get('.destroy').click({ force: true })

    // Confirm todo list has zero items
    cy.get('.todo-list li').should('have.length', 0)
  })
})
