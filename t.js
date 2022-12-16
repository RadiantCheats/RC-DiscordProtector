class a {
    [require('util').inspect.custom]() {
        return `asdasddas`;
    }
}
const an = new a();
console.log(an)