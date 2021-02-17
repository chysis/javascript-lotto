import { ALERT_MESSAGE } from '../../src/js/constants.js';

describe('LOTTO 테스트', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5500/');
  });

  it('사용자가 로또 구입 금액을 입력하고 확인 버튼을 누르면 금액에 맞는 로또가 화면에 보여진다.', () => {
    cy.get('.lotto-list-container').should('not.be.visible');
    cy.get('.winning-number-form-container').should('not.be.visible');

    cy.get('#money-input').type('10000');
    cy.get('#money-submit-button').click();

    cy.get('.lotto-list-container').should('be.visible');
    cy.get('.winning-number-form-container').should('be.visible');

    cy.get('.lotto-count').should('have.text', '10');
    cy.get('.lotto').should('have.length', '10');
  });

  it('사용자가 토글 버튼을 누르면 로또의 번호를 볼 수 있다.', () => {
    cy.get('#money-input').type('10000');
    cy.get('#money-submit-button').click();
    cy.get('#lotto-numbers-toggle').click();

    cy.get('.lotto-numbers').each(($elem) => {
      const numbers = $elem
        .text()
        .split(',')
        .map((number) => number.trim());
      expect(numbers.length).to.be.eq(6);

      numbers.forEach((_number) => {
        const number = Number(_number);
        expect(number).to.be.at.least(1);
        expect(number).to.be.at.most(45);
      });
    });
  });

  it('각 로또 안의 번호가 중복되지 않았는지 확인한다.', () => {
    cy.get('#money-input').type('10000');
    cy.get('#money-submit-button').click();
    cy.get('#lotto-numbers-toggle').click();

    cy.get('.lotto-numbers').each(($elem) => {
      const numbers = $elem
        .text()
        .split(',')
        .map((number) => number.trim());
      const numbersSet = new Set(numbers);
      expect(numbers.length).to.be.eq(numbersSet.size);
    });
  });

  it('사용자가 0원을 입력하면 경고창을 띄운다.', () => {
    const alertStub = cy.stub();
    cy.on('window:alert', alertStub);

    cy.get('#money-input').type('0');
    cy.get('#money-submit-button')
      .click()
      .then(() => {
        expect(alertStub.getCall(0)).to.be.calledWith(ALERT_MESSAGE.INVALID_MONEY_INPUT);
      });
  });

  it('사용자가 5500 원을 입력하면 화면에 로또가 5개 보여진다.', () => {
    cy.get('#money-input').type('5500');
    cy.get('#money-submit-button').click();

    cy.get('.lotto-list').children().should('have.length', 5);
  });
});
