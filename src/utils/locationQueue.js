const locationQueue = [];

const addToQueue = (location) => {
  locationQueue.push({
    ...location,
    timestamp: new Date(),
  });
};

const processQueue = async (updateLocationFn) => {
  while (locationQueue.length > 0) {
    const location = locationQueue.shift();
    try {
      await updateLocationFn(location);
    } catch (error) {
      locationQueue.unshift(location);
      break;
    }
  }
};

module.exports = { addToQueue, processQueue };
