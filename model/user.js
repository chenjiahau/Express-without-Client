class User {
  firstName = null;
  lastName = null;
  gender = "male"; // male female
  age = 0;
  email = null;
  location = {
    latitude: 0,
    longitude: 0,
  };
  money = 0;
  company = null;
  isActive = false;

  constructor(
    firstName,
    lastName,
    gender,
    age,
    email,
    latitude,
    longitude,
    money,
    company,
    isActive
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.gener = gender;
    this.age = age;
    this.email = email;
    this.location = {
      latitude: latitude,
      longitude: longitude,
    };
    this.money = money;
    this.company = company;
    this.isActive = isActive;
  }
}

module.exports = User;
