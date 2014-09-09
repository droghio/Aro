`
//
// John Drogo
// Aro Base
//
// Version 0.0.1a
`

class Test
	constructor: (@name)->

	showName: () ->
		console.log("My name is " + @name + ".")


jimmy = new Test("Jimmy")
jimmy.showName()
