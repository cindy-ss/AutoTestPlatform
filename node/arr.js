const arr = [
	{a:'fuck'},
	{a:'fuck2'}
];

arr.map(item => item.b = 'damn');

console.log(arr);