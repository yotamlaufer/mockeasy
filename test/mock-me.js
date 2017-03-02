const isStub = () => {
    return false;
};

function getString() {
    return 'this is a string';
}

exports.isStub = isStub;
exports.getString = getString;
