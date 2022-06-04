describe('spec.cy.ts', () => {
  it('should visit', () => {
    cy.visit('http://localhost:3000/')

    cy.get('[type="checkbox"]').check({force: true})
  })
})
