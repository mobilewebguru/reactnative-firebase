const Global = {
    // API_URL: 'http://192.168.0.108:8000/api',
    API_URL: 'http://ec2-52-15-244-115.us-east-2.compute.amazonaws.com/api',
    serverTimeFormat: 'YYYY-MM-DD HH:mm:ss',
    categories: [],
    // currentCoord: { latitude: 47.953865, longitude: 11.643472 },
    // currentCoord: { latitude: 59.9147, longitude: 10.7399 },
    currentCoord: { latitude: null, longitude: null },
    connectTimeout: 5000,
    mountTimeout: 1000,
    animationTimeout: 300,
    token: null,
    device: null,
    pageSize: 3,
};
export default Global;
