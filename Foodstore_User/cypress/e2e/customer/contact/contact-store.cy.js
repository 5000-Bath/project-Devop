describe('Contact Store Page', () => {
  const teamMembers = [
    { name: 'Weerapat Aphiphuwong', nickname: 'Film', github: 'https://github.com/FilmPNG', linkedin: 'https://www.linkedin.com/in/weerapat-aphiphuwong-a96406341/' },
    { name: 'Tas Sukastid', nickname: 'Tas', github: 'https://github.com/TasSukastid', linkedin: 'https://www.linkedin.com/in/tas-sukastid-bcc/' },
    { name: 'Yanaphat Jumpaburee', nickname: 'First', github: 'https://github.com/First97', linkedin: 'https://www.linkedin.com/in/yanaphat-jum-51905938b/' },
    { name: 'Kongphop Kaochot', nickname: 'Kong', github: 'https://github.com/Konggarage', linkedin: 'https://www.linkedin.com/in/kongphop-kaochot-14408a339/' },
    { name: 'Taned Somchervieng', nickname: 'Ake', github: 'https://github.com/tanert48', linkedin: 'https://www.linkedin.com/in/taned-somchirvieng-788918373' },
    { name: 'Peeranut Machaivech', nickname: 'Ohm', github: 'https://github.com/ohmmyrisingstar', linkedin: 'https://linkedin.com/in/sirapat' },
  ];

  it('US-C05: should display all team members correctly on the contact page', () => {
    cy.visit('/contact');
    cy.contains('h1', 'Meet Our Team').should('be.visible');
    cy.get('.team-grid').should('be.visible');
    cy.get('.team-card').should('have.length', teamMembers.length);

    teamMembers.forEach(member => {
      cy.contains('.team-card', member.name).within(() => {
        cy.contains('h3', member.name).should('be.visible');
        cy.contains('p', `"${member.nickname}"`).should('be.visible');
        cy.get('a.social-link.github').should('have.attr', 'href', member.github);
        cy.get('a.social-link.linkedin').should('have.attr', 'href', member.linkedin);
      });
    });
  });
});