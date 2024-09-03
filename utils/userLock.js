const resetFailedAttempts = async (user) => {
  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  user.isLocked = false;
  await user.save();
};

const handleFailedLoginAttempt = async (user, maxAttempts = 5) => {
  user.failedLoginAttempts += 1;
  if (user.failedLoginAttempts >= maxAttempts) {
    user.isLocked = true;
    user.lockUntil = new Date(Date.now() + 60 * 60 * 1000);
  }
  await user.save();
};

const checkIfLocked = (user) => {
  return user.isLocked && user.lockUntil > Date.now();
};

module.exports = {
  resetFailedAttempts,
  handleFailedLoginAttempt,
  checkIfLocked,
};
