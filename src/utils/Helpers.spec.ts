import { expect } from 'chai';
import { Indexed, merge, set, isEqual } from './Helpers';

describe('Проверяем Helpers', () => {

  describe('merge', () => {
    it('Должен объединить два объекта', () => {
      const lhs: Indexed = {
        prop1: 'value1',
        prop2: {
          nestedProp1: 'nestedValue1',
          nestedProp2: 'nestedValue2',
        },
      };

      const rhs: Indexed = {
        prop1: 'updatedValue',
        prop2: {
          nestedProp2: 'updatedNestedValue',
          nestedProp3: 'newNestedValue',
        },
        prop3: 'newProperty',
      };

      const expected: Indexed = {
        prop1: 'updatedValue',
        prop2: {
          nestedProp1: 'nestedValue1',
          nestedProp2: 'updatedNestedValue',
          nestedProp3: 'newNestedValue',
        },
        prop3: 'newProperty',
      };

      const result = merge(lhs, rhs);

      expect(result).to.deep.equal(expected);
    });
  });

  describe('set', () => {
    it('Должен установить значение по указанному пути', () => {
      const object: Indexed = {
        prop1: {
          prop2: {
            prop3: 'value',
          },
        },
      };

      const path = 'prop1.prop2.prop3';
      const value = 'updatedValue';

      const expected: Indexed = {
        prop1: {
          prop2: {
            prop3: 'updatedValue',
          },
        },
      };

      const result = set(object, path, value);

      expect(result).to.deep.equal(expected);
    });

    it('Должен возвращать тот же объект, если он не является объектом или нулевым значением', () => {
      const value = 'someValue';

      expect(set(value, 'path', value)).to.equal(value);
      expect(set(null, 'path', value)).to.equal(null);
    });
  });

  describe('isEqual', () => {
    it('Должен возвращать true, если два объекта равны', () => {
      const obj1 = {
        prop1: 'value1',
        prop2: {
          nestedProp: 'nestedValue',
        },
      };

      const obj2 = {
        prop1: 'value1',
        prop2: {
          nestedProp: 'nestedValue',
        },
      };

      expect(isEqual(obj1, obj2)).to.be.true;
    });

    it('Должен возвращать false, если два объекта не являются равными', () => {
      const obj1 = {
        prop1: 'value1',
        prop2: {
          nestedProp: 'nestedValue',
        },
      };

      const obj2 = {
        prop1: 'value1',
        prop2: {
          nestedProp: 'updatedNestedValue',
        },
      };

      expect(isEqual(obj1, obj2)).to.be.false;
    });

  });

});