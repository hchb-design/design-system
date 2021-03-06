/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Subtract16, Add16 } from '@carbon/icons-react';
import { settings } from 'carbon-components';
import React from 'react';
import { mount, shallow } from 'enzyme';
import { NumberInput } from '../NumberInput';
import NumberInputSkeleton from '../../NumberInput.Skeleton';

const { prefix } = settings;

describe('NumberInput', () => {
  describe('should render as expected', () => {
    let wrapper;
    let label;
    let numberInput;
    let container;
    let formItem;
    let icons;
    let helper;
    let mockProps;

    beforeEach(() => {
      mockProps = {
        min: 0,
        max: 100,
        id: 'test',
        label: 'Number Input',
        className: 'extra-class',
        invalidText: 'invalid text',
        helperText: 'testHelper',
        translateWithId:
          /*
          Simulates a condition where up/down button's hover over text matches `iconDescription` in `v10`,
          which is, when the translation for up/down button are not there
        */
          () => undefined,
      };

      wrapper = mount(<NumberInput {...mockProps} />);

      const iconTypes = [Subtract16, Add16];
      label = wrapper.find('label');
      numberInput = wrapper.find('input');
      container = wrapper.find(`.${prefix}--number`);
      formItem = wrapper.find(`.${prefix}--form-item`);
      icons = wrapper.findWhere((n) => iconTypes.includes(n.type()));
      helper = wrapper.find(`.${prefix}--form__helper-text`);
    });

    describe('input', () => {
      it('renders a numberInput', () => {
        expect(numberInput.length).toEqual(1);
      });

      it('has the expected classes', () => {
        expect(
          container.hasClass(`${prefix}--number ${prefix}--number--helpertext`)
        ).toEqual(true);
      });

      it('has renders with form-item wrapper', () => {
        expect(formItem.hasClass(`${prefix}--form-item`)).toEqual(true);
      });

      it('applies extra classes via className', () => {
        expect(container.hasClass('extra-class')).toEqual(true);
      });

      it('should set a min as expected', () => {
        expect(numberInput.prop('min')).toEqual(0);
        wrapper.setProps({ min: 10 });
        expect(wrapper.find('input').prop('min')).toEqual(10);
      });

      it('should set a max as expected', () => {
        expect(numberInput.prop('max')).toEqual(100);
        wrapper.setProps({ max: 10 });
        expect(wrapper.find('input').prop('max')).toEqual(10);
      });

      it('should set step as expected', () => {
        expect(numberInput.prop('step')).toEqual(1);
        wrapper.setProps({ step: 10 });
        expect(wrapper.find('input').prop('step')).toEqual(10);
      });

      it('should set disabled as expected', () => {
        expect(numberInput.prop('disabled')).toEqual(false);
        wrapper.setProps({ disabled: true });
        expect(wrapper.find('input').prop('disabled')).toEqual(true);
      });

      it('should set invalid as expected', () => {
        expect(container.prop('data-invalid')).toEqual(undefined);
        wrapper.setProps({ invalid: true });
        expect(wrapper.find(`.${prefix}--number`).prop('data-invalid')).toEqual(
          true
        );
      });

      it('should set invalidText as expected', () => {
        expect(wrapper.find(`.${prefix}--form-requirement`).length).toEqual(0);
        wrapper.setProps({ invalid: true });
        const invalidText = wrapper.find(`.${prefix}--form-requirement`);
        expect(invalidText.length).toEqual(1);
        expect(invalidText.text()).toEqual('invalid text');
      });

      it('should specify light number input as expected', () => {
        wrapper.setProps({ light: true });
        expect(wrapper.find(NumberInput).props().light).toEqual(true);
      });

      it('should hide label as expected', () => {
        expect(numberInput.prop('min')).toEqual(0);
        wrapper.setProps({ hideLabel: true });
        expect(
          wrapper.find('label').hasClass(`${prefix}--visually-hidden`)
        ).toEqual(true);
        expect(
          wrapper
            .find(`.${prefix}--number`)
            .hasClass(`${prefix}--number--nolabel`)
        ).toEqual(true);
      });

      describe('initial rendering', () => {
        const getWrapper = (min, max, value) =>
          mount(
            <NumberInput
              min={min}
              max={max}
              value={value}
              id="test"
              label="Number Input"
              className="extra-class"
              invalidText="Number is not valid"
            />
          );
        const getNumberInput = (wrapper) => wrapper.find('input');

        it('should correctly set defaultValue on uncontrolled input', () => {
          const wrapper = mount(
            <NumberInput
              min={-1}
              max={100}
              defaultValue={10}
              id="test"
              label="Number Input"
              className="extra-class"
            />
          );
          const numberInput = getNumberInput(wrapper);
          expect(numberInput.prop('value')).toEqual(10);
        });

        it('should set value as expected when value > min', () => {
          const wrapper = getWrapper(-1, 100, 0);
          const numberInput = getNumberInput(wrapper);
          expect(numberInput.prop('value')).toEqual(0);
        });

        it('should set value as expected when min === 0 and value > min', () => {
          const wrapper = getWrapper(0, 100, 1);
          const numberInput = getNumberInput(wrapper);
          expect(numberInput.prop('value')).toEqual(1);
        });

        it('should set value when value < min and set invalid state', () => {
          let wrapper = getWrapper(5, 100, 0);
          let numberInput = wrapper.find('input');
          let invalidText = wrapper.find(`.${prefix}--form-requirement`);
          expect(numberInput.prop('value')).toEqual(0);
          expect(invalidText.length).toEqual(1);
          expect(invalidText.text()).toEqual('Number is not valid');
        });

        it('should set value when min is undefined', () => {
          let wrapper = getWrapper(undefined, 100, 5);
          let numberInput = wrapper.find('input');
          expect(numberInput.prop('value')).toEqual(5);
        });

        it('should set invalidText when value is empty string', () => {
          wrapper.find('input').simulate('change', {
            target: {
              value: '',
            },
          });
          const invalidText = wrapper.find(`.${prefix}--form-requirement`);
          expect(invalidText.length).toEqual(1);
          expect(invalidText.text()).toEqual('invalid text');
        });

        it('allow empty string value', () => {
          wrapper.find('input').simulate('change', {
            target: {
              value: '',
            },
          });
          wrapper.setProps({ allowEmpty: true });
          const invalidText = wrapper.find(`.${prefix}--form-requirement`);
          expect(invalidText.length).toEqual(0);
        });

        it('should allow updating the value with empty string and not be invalid', () => {
          wrapper.find('input').simulate('change', {
            target: {
              value: 50,
            },
          });
          wrapper.setProps({ value: '', allowEmpty: true });
          const invalidText = wrapper.find(`.${prefix}--form-requirement`);
          expect(invalidText.length).toEqual(0);
        });

        it('should change the value upon change in props', () => {
          wrapper.setProps({ value: 1 });
          wrapper.find('input').simulate('change', {
            target: {
              value: 2,
            },
          });
          wrapper.setProps({ value: 2 });
          expect(wrapper.find('input').prop('value')).toEqual(2);
        });

        it('should not cap the number given to value prop', () => {
          wrapper.find('input').simulate('change', {
            target: {
              value: 0,
            },
          });

          wrapper.setProps({ value: 5, min: 10, max: 20 });
          expect(wrapper.find('input').prop('value')).toEqual(5);

          wrapper.setProps({ value: 25, min: 10, max: 20 });
          expect(wrapper.find('input').prop('value')).toEqual(25);
        });

        // NumberInput propTypes do not allow a string to be passed
        it('should avoid capping when non-number prop is given to value prop', () => {
          wrapper.find('input').simulate('change', {
            target: {
              value: 2,
            },
          });

          wrapper.setProps({ value: '', min: 1, max: 3 });
          expect(wrapper.find('input').prop('value')).toBe('');
        });

        it('should avoid change the value upon setting props, unless there the value actually changes', () => {
          wrapper.setProps({ value: 1 });
          wrapper.find('input').simulate('change', {
            target: {
              value: 2,
            },
          });
          wrapper.setProps({ value: 1 });
          expect(wrapper.find('input').prop('value')).toBe(2);
        });
      });
    });

    describe('Icon', () => {
      it('renders two Icon components', () => {
        expect(icons.length).toEqual(2);
      });

      it('should use correct icons', () => {
        expect(icons.at(0).type()).toBe(Subtract16);
        expect(icons.at(1).type()).toBe(Add16);
      });

      it('adds new iconDescription when passed via props', () => {
        wrapper.setProps({ iconDescription: 'new description' });
        expect(wrapper.prop('iconDescription')).toEqual('new description');
      });

      it('should have iconDescription match Icon component description prop', () => {
        wrapper.setProps({ iconDescription: 'test' });
        const iconUpText = wrapper.find('button.up-icon').prop('title');
        const iconDownText = wrapper.find('button.down-icon').prop('title');
        const iconDescription = wrapper
          .find(NumberInput)
          .prop('iconDescription');

        const matches =
          iconDescription === iconUpText && iconDescription === iconDownText;
        expect(matches).toEqual(true);
      });
    });

    describe('label', () => {
      it('renders a label', () => {
        expect(label.length).toEqual(1);
      });

      it('has the expected classes', () => {
        expect(label.hasClass(`${prefix}--label`)).toEqual(true);
      });
    });

    describe('helper', () => {
      it('renders a helper', () => {
        expect(helper.length).toEqual(1);
      });

      it('renders children as expected', () => {
        wrapper.setProps({
          helperText: <span>This is helper text.</span>,
        });
        const renderedHelper = wrapper.find(`.${prefix}--form__helper-text`);
        expect(renderedHelper.props().children).toEqual(
          <span>This is helper text.</span>
        );
      });

      it('should set helper text as expected', () => {
        wrapper.setProps({ helperText: 'Helper text' });
        expect(helper.text()).toEqual('Helper text');
      });
    });
  });

  describe('events', () => {
    describe('disabled numberInput', () => {
      const onClick = jest.fn();
      const onChange = jest.fn();

      const wrapper = mount(
        <NumberInput id="test" onClick={onClick} onChange={onChange} disabled />
      );

      const input = wrapper.find('input');
      const upArrow = wrapper.find('button.up-icon');
      const downArrow = wrapper.find('button.down-icon');

      it('should be disabled when numberInput is disabled', () => {
        expect(upArrow.prop('disabled')).toEqual(true);
        expect(downArrow.prop('disabled')).toEqual(true);
      });

      it('should not invoke onClick when up arrow is clicked', () => {
        upArrow.simulate('click');
        expect(onClick).not.toHaveBeenCalled();
      });

      it('should not invoke onClick when down arrow is clicked', () => {
        downArrow.simulate('click');
        expect(onClick).not.toHaveBeenCalled();
      });

      it('should not invoke onChange when numberInput is changed', () => {
        input.simulate('change');
        expect(onChange).not.toHaveBeenCalled();
      });
    });

    describe('enabled numberInput', () => {
      let onClick;
      let onChange;
      let input;
      let upArrow;
      let downArrow;
      let wrapper;

      beforeEach(() => {
        onClick = jest.fn();
        onChange = jest.fn();

        wrapper = mount(
          <NumberInput
            id="test"
            onClick={onClick}
            onChange={onChange}
            min={0}
            max={100}
          />
        );

        input = wrapper.find('input');
        upArrow = wrapper.find(Add16).closest('button');
        downArrow = wrapper.find(Subtract16).closest('button');
      });

      it('should invoke onClick when numberInput is clicked', () => {
        input.simulate('click');
        expect(onClick).toHaveBeenCalled();
      });

      it('should invoke onClick when up arrow is clicked', () => {
        wrapper.setProps({ value: 1 });
        upArrow.simulate('click');
        expect(onClick).toHaveBeenCalled();
        expect(onClick).toHaveBeenCalledWith(expect.anything(), {
          direction: 'up',
          value: 2,
        });
      });

      it('should only increase the value on up arrow click if value is less than max', () => {
        wrapper.setProps({ value: 100 });
        upArrow.simulate('click');
        expect(wrapper.find('input').prop('value')).toEqual(100);
      });

      it('should only decrease the value on down arrow click if value is greater than min', () => {
        wrapper.setProps({ value: 0 });
        downArrow.simulate('click');
        expect(wrapper.find('input').prop('value')).toEqual(0);
      });

      it('should increase by the value of step', () => {
        wrapper.setProps({
          step: 10,
          value: 0,
        });
        expect(wrapper.find('input').prop('value')).toEqual(0);
        upArrow.simulate('click');
        expect(wrapper.find('input').prop('value')).toEqual(10);
      });

      it('should decrease by the value of step', () => {
        wrapper.setProps({
          step: 10,
          value: 100,
        });
        expect(wrapper.find('input').prop('value')).toEqual(100);
        downArrow.simulate('click');
        expect(wrapper.find('input').prop('value')).toEqual(90);
      });

      it('should invoke onClick when down arrow is clicked and value is above min', () => {
        wrapper.setProps({ value: 1 });
        downArrow.simulate('click');
        expect(onClick).toHaveBeenCalled();
        expect(onChange).toHaveBeenCalled();
        expect(onClick).toHaveBeenCalledWith(expect.anything(), {
          direction: 'down',
          value: 0,
        });
      });

      it('should invoke onChange when numberInput is changed', () => {
        input.simulate('change');
        expect(onChange).toHaveBeenCalled();
        expect(onChange).toHaveBeenCalledWith(
          expect.anything(),
          expect.anything()
        );
      });
    });
  });
});

describe('NumberInputSkeleton', () => {
  describe('Renders as expected', () => {
    const wrapper = shallow(<NumberInputSkeleton />);

    const container = wrapper.find(`.${prefix}--number`);
    const label = wrapper.find(`.${prefix}--label`);

    it('has the expected classes', () => {
      expect(container.hasClass(`${prefix}--skeleton`)).toEqual(true);
      expect(label.hasClass(`${prefix}--skeleton`)).toEqual(true);
    });
  });
});
