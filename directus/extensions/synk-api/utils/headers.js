const getHeaders = (apiKey) => ({
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  });
  
  module.exports = { getHeaders };
  