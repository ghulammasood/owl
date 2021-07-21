import { makeTestFixture, snapshotEverything, nextTick } from "../helpers";
import { mount, Component, useState, xml } from "../../src/index";

snapshotEverything();

let fixture: HTMLElement;

beforeEach(() => {
  fixture = makeTestFixture();
});

describe("event handling", () => {
  test("can set handler on sub component", async () => {
    class Child extends Component {
      static template = xml`<div>simple vnode</div>`;
    }

    class Parent extends Component {
      static template = xml`<Child t-on-click="inc"/><t t-esc="state.value"/>`;
      static components = { Child };
      state = useState({ value: 1 });
      inc() {
        this.state.value++;
      }
    }

    await mount(Parent, fixture);
    expect(fixture.innerHTML).toBe("<div>simple vnode</div>1");

    fixture.querySelector("div")!.click();
    await nextTick();
    expect(fixture.innerHTML).toBe("<div>simple vnode</div>2");
  });

  test("handler receive the event as argument", async () => {
    class Child extends Component {
      static template = xml`<div>simple vnode</div>`;
    }

    class Parent extends Component {
      static template = xml`<Child t-on-click="inc"/><t t-esc="state.value"/>`;
      static components = { Child };
      state = useState({ value: 1 });
      inc(ev: any) {
        this.state.value++;
        expect(ev.type).toBe("click");
      }
    }

    await mount(Parent, fixture);
    expect(fixture.innerHTML).toBe("<div>simple vnode</div>1");

    fixture.querySelector("div")!.click();
    await nextTick();
    expect(fixture.innerHTML).toBe("<div>simple vnode</div>2");
  });
});