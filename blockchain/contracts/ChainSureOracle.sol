// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title ChainSureOracle
 * @dev Oracle contract for providing external data to insurance contracts
 * Handles flight data, weather data, and AI analysis results
 */
contract ChainSureOracle is Ownable, ReentrancyGuard {
    
    struct FlightData {
        string flightNumber;
        uint256 scheduledDeparture;
        uint256 actualDeparture;
        uint256 delay;
        bool isCancelled;
        uint256 timestamp;
    }
    
    struct WeatherData {
        string location;
        int256 temperature;
        uint256 humidity;
        uint256 windSpeed;
        string conditions;
        uint256 timestamp;
    }
    
    struct AIAnalysisResult {
        bytes32 documentHash;
        uint256 fraudScore; // 0-1000 (0-100%)
        uint256 authenticityScore; // 0-1000 (0-100%)
        uint256 estimatedAmount;
        bool isApproved;
        uint256 timestamp;
    }

    mapping(string => FlightData) public flightData;
    mapping(string => WeatherData) public weatherData;
    mapping(bytes32 => AIAnalysisResult) public aiAnalysisResults;
    mapping(address => bool) public authorizedReporters;
    
    event FlightDataUpdated(string indexed flightNumber, uint256 delay, bool cancelled);
    event WeatherDataUpdated(string indexed location, string conditions);
    event AIAnalysisUpdated(bytes32 indexed documentHash, uint256 fraudScore, bool approved);
    event ReporterAuthorized(address indexed reporter);
    event ReporterDeauthorized(address indexed reporter);

    modifier onlyAuthorized() {
        require(authorizedReporters[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }

    constructor() {
        authorizedReporters[msg.sender] = true;
    }

    /**
     * @dev Update flight data
     */
    function updateFlightData(
        string memory flightNumber,
        uint256 scheduledDeparture,
        uint256 actualDeparture,
        uint256 delay,
        bool isCancelled
    ) external onlyAuthorized {
        flightData[flightNumber] = FlightData({
            flightNumber: flightNumber,
            scheduledDeparture: scheduledDeparture,
            actualDeparture: actualDeparture,
            delay: delay,
            isCancelled: isCancelled,
            timestamp: block.timestamp
        });
        
        emit FlightDataUpdated(flightNumber, delay, isCancelled);
    }

    /**
     * @dev Update weather data
     */
    function updateWeatherData(
        string memory location,
        int256 temperature,
        uint256 humidity,
        uint256 windSpeed,
        string memory conditions
    ) external onlyAuthorized {
        weatherData[location] = WeatherData({
            location: location,
            temperature: temperature,
            humidity: humidity,
            windSpeed: windSpeed,
            conditions: conditions,
            timestamp: block.timestamp
        });
        
        emit WeatherDataUpdated(location, conditions);
    }

    /**
     * @dev Update AI analysis result
     */
    function updateAIAnalysis(
        bytes32 documentHash,
        uint256 fraudScore,
        uint256 authenticityScore,
        uint256 estimatedAmount,
        bool isApproved
    ) external onlyAuthorized {
        require(fraudScore <= 1000, "Invalid fraud score");
        require(authenticityScore <= 1000, "Invalid authenticity score");
        
        aiAnalysisResults[documentHash] = AIAnalysisResult({
            documentHash: documentHash,
            fraudScore: fraudScore,
            authenticityScore: authenticityScore,
            estimatedAmount: estimatedAmount,
            isApproved: isApproved,
            timestamp: block.timestamp
        });
        
        emit AIAnalysisUpdated(documentHash, fraudScore, isApproved);
    }

    /**
     * @dev Get flight data
     */
    function getFlightData(string memory flightNumber) external view returns (FlightData memory) {
        return flightData[flightNumber];
    }

    /**
     * @dev Get weather data
     */
    function getWeatherData(string memory location) external view returns (WeatherData memory) {
        return weatherData[location];
    }

    /**
     * @dev Get AI analysis result
     */
    function getAIAnalysis(bytes32 documentHash) external view returns (AIAnalysisResult memory) {
        return aiAnalysisResults[documentHash];
    }

    /**
     * @dev Check if flight is delayed beyond threshold
     */
    function isFlightDelayed(string memory flightNumber, uint256 thresholdMinutes) external view returns (bool) {
        FlightData memory flight = flightData[flightNumber];
        return flight.delay >= (thresholdMinutes * 60) || flight.isCancelled;
    }

    /**
     * @dev Check if weather conditions meet certain criteria
     */
    function isWeatherAdverse(
        string memory location,
        uint256 maxWindSpeed,
        string memory excludedCondition
    ) external view returns (bool) {
        WeatherData memory weather = weatherData[location];
        
        if (weather.windSpeed > maxWindSpeed) {
            return true;
        }
        
        // Simple string comparison (in production, use more sophisticated comparison)
        if (keccak256(bytes(weather.conditions)) == keccak256(bytes(excludedCondition))) {
            return true;
        }
        
        return false;
    }

    /**
     * @dev Authorize a reporter
     */
    function authorizeReporter(address reporter) external onlyOwner {
        require(reporter != address(0), "Invalid address");
        authorizedReporters[reporter] = true;
        emit ReporterAuthorized(reporter);
    }

    /**
     * @dev Deauthorize a reporter
     */
    function deauthorizeReporter(address reporter) external onlyOwner {
        authorizedReporters[reporter] = false;
        emit ReporterDeauthorized(reporter);
    }

    /**
     * @dev Batch update flight data
     */
    function batchUpdateFlightData(
        string[] memory flightNumbers,
        uint256[] memory scheduledDepartures,
        uint256[] memory actualDepartures,
        uint256[] memory delays,
        bool[] memory cancellations
    ) external onlyAuthorized {
        require(
            flightNumbers.length == scheduledDepartures.length &&
            scheduledDepartures.length == actualDepartures.length &&
            actualDepartures.length == delays.length &&
            delays.length == cancellations.length,
            "Array lengths mismatch"
        );
        
        for (uint256 i = 0; i < flightNumbers.length; i++) {
            updateFlightData(
                flightNumbers[i],
                scheduledDepartures[i],
                actualDepartures[i],
                delays[i],
                cancellations[i]
            );
        }
    }
} 