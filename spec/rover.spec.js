const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {
    it("constructor sets position and default values for mode and generatorWatts", function() {
        let rover = new Rover(4000);
        expect(rover.position).toBe(4000);
        expect(rover.mode).toBe("NORMAL");
        expect(rover.generatorWatts).toBe(110);
    })

    it("response returned by receiveMessage contains the name of the message", function(){
        let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
        let rover = new Rover(7777);
        let message = new Message("Name test", commands);
        let response = rover.receiveMessage(message);
        expect(response.message).toEqual("Name test");
    })

    it("response returned by receiveMessage includes two results if two commands are sent in the message", function(){
        let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
        let rover = new Rover(7777);
        let message = new Message("Name test", commands);
        let response = rover.receiveMessage(message).results;
        expect(response.length).toEqual(commands.length);
    })

    it("responds correctly to the status check command", function() {
        let commands = [new Command('STATUS_CHECK')];
        let rover = new Rover(6666);
        let message = new Message("Status test", commands);
        let response = rover.receiveMessage(message);
        expect(response.results[0].roverStatus.position).toBe(6666);
        expect(response.results[0].roverStatus.mode).toBe("NORMAL");
        expect(response.results[0].roverStatus.generatorWatts).toBe(110);
    })

    it("responds correctly to the mode change command", function() {
        let commands = [new Command('MODE_CHANGE', 'LOW_POWER')];
        let message = new Message("Big mode test", commands);
        let rover = new Rover(100);
        let response = rover.receiveMessage(message);
        let completed = {completed: true}
        expect(rover.mode).toBe('LOW_POWER');
        expect(response.results[0]).toEqual(completed);
    })

    it("responds with a false completed value when attempting to move in LOW_POWER mode", function() {
        let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('MOVE', 200)];
        let message = new Message("Low Power test", commands);
        let rover = new Rover(100)
        let completed = {completed: false}
        let response = rover.receiveMessage(message);
        expect(rover.mode).toBe('LOW_POWER');
        expect(response.results[1]).toEqual(completed);
    })

    it("responds with the position for the move command", function() {
        let commands = [new Command('MOVE', 6969)]
        let message = new Message('move', commands);
        let rover = new Rover(6060);
        let response = rover.receiveMessage(message);
        expect(rover.position).toEqual(6969);
    })
  

});
