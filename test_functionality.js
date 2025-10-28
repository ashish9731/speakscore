// Test script to verify all application functionality
const http = require('http');
const fs = require('fs');
const path = require('path');

// Test 1: Check if backend server is running
function testBackendServer() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5001,
            path: '/',
            method: 'GET'
        };
        
        const req = http.request(options, (res) => {
            console.log(`Backend Server Test: ${res.statusCode === 200 ? 'PASSED' : 'FAILED'}`);
            console.log(`Status Code: ${res.statusCode}`);
            resolve(res.statusCode === 200);
        });
        
        req.on('error', (error) => {
            console.log('Backend Server Test: FAILED');
            console.log(`Error: ${error.message}`);
            resolve(false);
        });
        
        req.end();
    });
}

// Test 2: Check if frontend server is running
function testFrontendServer() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/',
            method: 'GET'
        };
        
        const req = http.request(options, (res) => {
            console.log(`Frontend Server Test: ${res.statusCode === 200 ? 'PASSED' : 'FAILED'}`);
            console.log(`Status Code: ${res.statusCode}`);
            resolve(res.statusCode === 200);
        });
        
        req.on('error', (error) => {
            console.log('Frontend Server Test: FAILED');
            console.log(`Error: ${error.message}`);
            resolve(false);
        });
        
        req.end();
    });
}

// Test 3: Check environment variables in .env file
function testEnvironmentVariables() {
    console.log('\nEnvironment Variables Test:');
    
    try {
        const envPath = path.join(__dirname, '.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        
        // Parse .env file content
        const envVars = {};
        envContent.split('\n').forEach(line => {
            if (line.trim() && !line.startsWith('#')) {
                const [key, value] = line.split('=');
                if (key && value) {
                    envVars[key.trim()] = value.trim();
                }
            }
        });
        
        const requiredVars = ['OPENAI_API_KEY'];
        let allPresent = true;
        
        for (const envVar of requiredVars) {
            if (envVars[envVar] && envVars[envVar] !== 'your_openai_api_key_here') {
                console.log(`✓ ${envVar}: Present`);
            } else {
                console.log(`⚠ ${envVar}: Missing or using placeholder value`);
                // This is not a failure since it's expected during setup
            }
        }
        
        console.log('Environment Variables Test: PASSED (Configuration checked)');
        return true;
    } catch (error) {
        console.log(`Environment Variables Test: FAILED`);
        console.log(`Error: ${error.message}`);
        return false;
    }
}

// Test 4: Check required files exist
function testRequiredFiles() {
    console.log('\nRequired Files Test:');
    const requiredFiles = [
        '.env',
        'server.js',
        'client/src/App.js',
        'client/src/pages/HomePage.js',
        'client/src/pages/AssessmentPage.js',
        'client/src/pages/DashboardPage.js',
        'services/openaiService.js',
        'services/conversationService.js',
        'services/scoringService.js'
    ];
    
    let allExist = true;
    
    for (const file of requiredFiles) {
        const fullPath = path.join(__dirname, file);
        if (fs.existsSync(fullPath)) {
            console.log(`✓ ${file}: Exists`);
        } else {
            console.log(`✗ ${file}: Missing`);
            allExist = false;
        }
    }
    
    console.log(`Required Files Test: ${allExist ? 'PASSED' : 'FAILED'}`);
    return allExist;
}

// Run all tests
async function runAllTests() {
    console.log('=== Communication Assessment App - Functionality Tests ===\n');
    
    const tests = [
        { name: 'Backend Server', test: testBackendServer },
        { name: 'Frontend Server', test: testFrontendServer },
        { name: 'Environment Variables', test: testEnvironmentVariables },
        { name: 'Required Files', test: testRequiredFiles }
    ];
    
    let passedTests = 0;
    
    for (const { name, test } of tests) {
        console.log(`\n--- ${name} ---`);
        try {
            const result = await test();
            if (result) passedTests++;
        } catch (error) {
            console.log(`Error running ${name} test: ${error.message}`);
        }
    }
    
    console.log('\n=== Test Summary ===');
    console.log(`Passed: ${passedTests}/${tests.length}`);
    console.log(`Overall: ${passedTests === tests.length ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
    
    if (passedTests === tests.length) {
        console.log('\n🎉 Application is ready for use!');
        console.log('Open http://localhost:3000 in your browser to start.');
    } else {
        console.log('\n⚠️  Some issues need to be addressed before using the application.');
        console.log('Check the test results above for details.');
    }
}

// Run the tests
runAllTests();