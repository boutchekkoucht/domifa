import { faker } from "@faker-js/faker";
faker.setLocale("fr");

export const dataGenerator = {
  firstName,
  lastName,
  phoneNumber,
  fromList,
  fromListAndRemove,
  number,
  boolean,
  date,
  email,
  city,
};

function firstName() {
  return faker.name.firstName();
}
function city() {
  return faker.address.city();
}
function lastName() {
  return faker.name.lastName();
}
function phoneNumber() {
  return faker.phone.phoneNumber();
}
function email({
  firstName,
  lastName,
  provider,
}: {
  firstName?: string;
  lastName?: string;
  provider?: string;
}) {
  return faker.internet.email(firstName, lastName, provider);
}

function fromList<T>(list: T[]): T {
  const length = list.length;
  const randomIndex = faker.datatype.number({
    min: 0,
    max: length - 1,
  });
  return list[randomIndex];
}

function fromListAndRemove<T>(list: T[]): {
  item: T;
  remaining: T[];
} {
  const length = list.length;

  if (length === 0) {
    return {
      item: undefined,
      remaining: [],
    };
  }
  const randomIndex = faker.datatype.number({
    min: 0,
    max: length - 1,
  });
  const remaining = list.concat([]);
  remaining.splice(randomIndex, 1);
  const res = {
    item: list[randomIndex],
    remaining,
  };

  return res;
}

function number(options?: {
  min?: number;
  max?: number;
  precision?: number;
}): number {
  return faker.datatype.number(options);
}

function boolean(options?: { percentageTrue?: number }): boolean {
  if (options && options.percentageTrue) {
    return number({ min: 1, max: 100, precision: 1 }) <= options.percentageTrue;
  }
  return faker.datatype.boolean();
}

type MinMaxOptions = {
  min: number;
  max: number;
};

function date(options: {
  refDate?: Date;
  years?: MinMaxOptions;
  days?: MinMaxOptions;
}): Date {
  const refDate = options.refDate ? options.refDate : new Date();

  const { days, years } = options;

  if (years) {
    const min = (years.min ? years.min : 0) * 365 * 24 * 60;
    const max = years.max * 365 * 24 * 60;
    const minutesDiff = number({ min, max, precision: 1 });
    return removeTime(refDate.getTime() + minutesDiff * 60 * 1000);
  }

  if (days) {
    const min = (days.min ? days.min : 0) * 24 * 60;
    const max = days.max * 24 * 60;
    const minutesDiff = number({ min, max, precision: 1 });
    return removeTime(refDate.getTime() + minutesDiff * 60 * 1000);
  }

  return removeTime(refDate);
}

function removeTime(date: Date | number): Date {
  date = new Date(date);
  date.setUTCHours(0);
  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);
  return date;
}
