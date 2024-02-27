<script>
    import PDFHTML from "./PDFHTML.svelte"

    import { jsPDF } from "jspdf"
    import { config } from "$lib/config/app.config"
    import { successAlert, errorAlert } from "$lib/helper/alert"


    let selectedTab = "overview"

    const downloadDocumentation = async () => {
        let doc = new jsPDF()
        let target = document.getElementById("html-to-pdf")
        let content = new PDFHTML({ target })

        doc.html(target, {
            callback: function (doc) {
                doc.save("api_documentation.pdf")
                content.$destroy()
            },
            margin: [10, 10, 10, 10],
            autoPaging: "text",
            x: 0,
            y: 0,
            width: 190,
            windowWidth: 700
        })
    }

    const copyPythonToClipboard = () => {
        navigator.clipboard.writeText(`
import requests
import json

# Login endpoint URL
url = 'https://original.epushagency.eg/api/auth/user/signin'

# Request headers
headers = {
    'Content-Type' : 'application/json'
}

# Request body
payload = {
    'username' : 'client@epushagency.com' ,
    'password' : 'password'
}

# Sending the POST request
response = requests.post(url, headers=headers, data=json.dumps(payload))

# Check for errors
if response.status_code != 200 :
    print('Failed to make the request. Status code:' , response.status_code)
else:
    response_data = response.json()
    access_token = response_data.data.access_token

    # Send Message URL
    url = 'https://original.epushagency.eg/api/message/send'

    # Request headers
    headers = {
        'Content-Type' : 'application/json' ,
        'Authorization' : 'bearer ' + access_token
    }

    # Request body
    payload = {
        'message' : 'Hello every one',
        'sender' : 'Ahmed ORG',
        'language' : 'English',
        'api_key' : 'epush-v1.0-1702933754759-accdc39b52596818-a5abb1500bdeaef41e2edd598c015edf',
        'group_name' : 'Important Group' ,
        'number' : [
            '201126999840',
            '201147485440'
        ]
    }

    # Sending the POST request
    response = requests.post(url, headers=headers, data=json.dumps(payload))

    # Check for errors
    if response.status_code != 200 :
        print('Failed to make the request. Status code:' , response.status_code)
    else:
        # Handle the response
        response_data = response.json()

        `)
        .then(() => {
            successAlert('Copied to clipboard', 2)
        })
        .catch(err => {
            errorAlert('Error copying to clipboard: ' + err.message, 5)
        })
    }

    const copyPHPToClipboard = () => {
        navigator.clipboard.writeText(`
// Login endpoint URL
$url = 'https://original.epushagency.eg/api/auth/user/signin';


// Request headers
$headers = array (
    'Content-Type: application/json'
);


// Request body
$data = array (
    'username' => 'client@epushagency.com',
    'password' => 'password'
) ;


// Initialize cURL session
$ch = curl_init();

// Set cURL options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute the cURL session
$response = curl_exec($ch);

// Check for errors
if ($response === false) {
    echo 'cURL error: ' . curl_error($ch);
}

// Close cURL session
curl_close($ch);

// Get access token
$access_token = $response['data']['access_token'];


// Send Message URL
$url = 'https://original.epushagency.eg/api/message/send';

// Request headers
$headers = array (
    'Content-Type: application/json',
    'Authorization: bearer ' . $access_token
);

// Request body
$data = array (
    'message' => 'Hello every one',
    'sender' => 'Ahmed ORG',
    'language' => 'English',
    'api_key' => 'epush-v1.0-1702933754759-accdc39b52596818-a5abb1500bdeaef41e2edd598c015edf',
    'group_name' => 'Important Group',
    'numbers' => [
        '201126999840',
        '201147485440'
    ]
);

// Initialize cURL session
$ch = curl_init();

// Set cURL options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute the cURL session
$response = curl_exec($ch);

// Check for errors
if ($response === false) {
    echo 'cURL error: ' . curl_error($ch);
}

// Close cURL session
curl_close($ch);

// Handle the response
echo $response;

        `)
        .then(() => {
            successAlert('Copied to clipboard', 2)
        })
        .catch(err => {
            errorAlert('Error copying to clipboard: ' + err.message, 5)
        })
    }

    const copyDotNetToClipboard = () => {
        navigator.clipboard.writeText(`
// API endpoint URL
string url = 'https://original.epushagency.eg/api/auth/user/signin';

// Request headers
var headers = new Dictionary<string, string>();
headers.Add('Content-Type', 'application/json');

// Request body
var data = new {
    username = 'client@epushagency.com',
    password = 'password'
};

// Initialize HttpClient
using (var client = new HttpClient())
{
    // Set request headers
    foreach (var header in headers)
    {
        client.DefaultRequestHeaders.Add(header.key, header.value);
    }

    // Execute the POST request
    var response = await client.PostAsync(url, new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json"));

    // Check for errors
    if (! response.IsSuccessStatusCode)
    {
        Console.WriteLine("HTTP error: " + response.StatusCode);
    }
    else
    {
        // Get access token
        var content = await response.Content.ReadAsStringAsync();
        var result = JsonConvert.DeserializeObject<dynamic>(content);
        string access_token = result.data.access_token;

        // Send Message URL
        string url = 'https://original.epushagency.eg/api/message/send';

        // Request headers
        headers.Add('Authorization', 'bearer ' + access_token);

        // Request body
        data = new {
            message = 'Hello every one',
            sender = 'Ahmed ORG',
            language = 'English',
            api_key = 'epush-v1.0-1702933754759-accdc39b52596818-a5abb1500bdeaef41e2edd598c015edf',
            group_name = 'Important Group',
            numbers = new string[] {
                '201126999840'
                '201147485440'
            }
        };

        // Execute the POST request
        response = await client.PostAsync(url, new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json"));

        // Check for errors
        if (! response.IsSuccessStatusCode)
        {
            Console.WriteLine("HTTP error: " + response.StatusCode);
        }
        else
        {
            // Handle the response
            content = await response.Content.ReadAsStringAsync();
        }
    }
}
        `)
        .then(() => {
            successAlert('Copied to clipboard', 2)
        })
        .catch(err => {
            errorAlert('Error copying to clipboard: ' + err.message, 5)
        })
    }
</script>

<div class="flex flex-col items-start self-stretch gap-6">
    <div class="flex items-start self-stretch gap-4 pb-5 border-b">
        <div class="flex flex-col justify-center items-start flex-1 self-stretch gap-1">
            <span class="self-stretch text-gray-900 text-lg font-semibold">Epush API Documentation</span>
            <span class="self-stretch text-gray-600 text-sm">Learn more about our API</span>
        </div>
        <button on:click={downloadDocumentation} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17.5 17.5H2.5M15 9.16667L10 14.1667M10 14.1667L5 9.16667M10 14.1667V2.5" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-gray-700 text-sm font-semibold">Download PDF</span>
        </button>
    </div>
    <div class="flex items-start self-stretch gap-6 border-b pb-6">
        <div class="flex flex-col items-start gap-1 p-1 rounded-lg border border-gray-100 bg-gray-100 min-w-44">
            <button on:click={() => selectedTab = "overview"} class="flex items-center self-stretch gap-2 py-2 px-3 rounded {selectedTab == "overview" && "bg-white shadow-sm"}">
                <span class="{selectedTab == "overview" ? "text-gray-700" : "text-gray-500"} text-sm font-semibold">Overview</span>
            </button>
            <button on:click={() => selectedTab = "getting-started"} class="flex items-center self-stretch gap-2 py-2 px-3 rounded {selectedTab == "getting-started" && "bg-white shadow-sm"}">
                <span class="{selectedTab == "getting-started" ? "text-gray-700" : "text-gray-500"} text-sm font-semibold">Getting Started</span>
            </button>
            <button on:click={() => selectedTab = "concepts"} class="flex items-center self-stretch gap-2 py-2 px-3 rounded {selectedTab == "concepts" && "bg-white shadow-sm"}">
                <span class="{selectedTab == "concepts" ? "text-gray-700" : "text-gray-500"} text-sm font-semibold">Concepts</span>
            </button>
            <button on:click={() => selectedTab = "send-sms"} class="flex items-center self-stretch gap-2 py-2 px-3 rounded {selectedTab == "send-sms" && "bg-white shadow-sm"}">
                <span class="{selectedTab == "send-sms" ? "text-gray-700" : "text-gray-500"} text-sm font-semibold">Send SMS</span>
            </button>
            <button on:click={() => selectedTab = "groups"} class="flex items-center self-stretch gap-2 py-2 px-3 rounded {selectedTab == "groups" && "bg-white shadow-sm"}">
                <span class="{selectedTab == "groups" ? "text-gray-700" : "text-gray-500"} text-sm font-semibold">Groups</span>
            </button>
            <button on:click={() => selectedTab = "integrations"} class="flex items-center self-stretch gap-2 py-2 px-3 rounded {selectedTab == "integrations" && "bg-white shadow-sm"}">
                <span class="{selectedTab == "integrations" ? "text-gray-700" : "text-gray-500"} text-sm font-semibold">Integrations</span>
            </button>
        </div>

        {#if selectedTab == "overview"}
        <div class="flex flex-col flex-1 items-start gap-4">
            <span class="self-stretch text-gray-900 font-semibold">Overview</span>
            <div class="flex flex-col self-stretch text-gray-600 text-sm gap-3">
                <span class="flex">
                    The E-Push API adheres to the REST architectural style, emphasizing a structured and standardized approach 
                    to web service design. Our API is meticulously crafted with a focus on resource-oriented URLs, enabling users 
                    to interact with well-defined endpoints for various operations. Requests to our API are expected to be form-encoded, 
                    ensuring data integrity and consistency in the communication process.
                </span>
                <span class="flex">
                    Furthermore, the E-Push API delivers responses in JSON format, providing a versatile and widely supported data 
                    interchange format for seamless integration with diverse systems. By leveraging standard HTTP response codes, 
                    users can easily interpret the outcomes of their API requests, facilitating efficient error handling and 
                    troubleshooting.
                </span>
                <span class="flex">
                    Authentication mechanisms employed by our API adhere to industry best practices, ensuring secure access and data 
                    protection. Through the utilization of standard HTTP verbs such as GET, POST, PUT, and DELETE, users can perform 
                    a range of actions on the resources exposed by the API, promoting versatility and interoperability within the 
                    application ecosystem.
                </span>
            </div>
        </div>
        {/if}

        {#if selectedTab == "getting-started"}
        <div class="flex flex-col items-start self-stretch gap-10">
            <div class="flex flex-col flex-1 items-start gap-4">
                <span class="self-stretch text-gray-900 font-semibold">Getting Started</span>
                <span class="self-stretch text-gray-600 text-sm">
                    In order to commence utilizing our APIs, it is imperative to initiate access by interfacing with our 
                    sophisticated Authentication and Authorization system. This process entails engaging with a user-friendly 
                    login endpoint that requires your username and password for authentication. Upon a successful authentication 
                    attempt, the system will furnish you with an access_token and refresh_token. Subsequently, when interacting 
                    with the send message API, it is crucial to employ the access_token received earlier by configuring the 
                    Authorization key within the request headers, ensuring that the value corresponds to the access_token issued 
                    during the authentication process. This meticulous procedure guarantees secure and authorized access to our API 
                    functionalities.
                </span>
            </div>
            <div class="flex flex-col items-start self-stretch flex-1 gap-8 font-mono">
                <div class="flex flex-col items-start self-stretch flex-1 gap-2">
                    <span class="self-stretch text-gray-900 text-sm font-medium">URL</span>
                    <div class="flex justify-center items-start self-stretch rounded-xl bg-gray-900">
                        <div class="flex flex-col items-start self-stretch p-4 bg-gray-800 rounded-l-xl">
                            <span class="text-gray-300 font-bold text-sm">POST</span>
                        </div>
                        <div class="flex items-start flex-1 p-4">
                            <p class="flex-1 text-gray-50 text-sm font-medium">
                                {config("SERVER_URL") + "/auth/user/signin"}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col items-start self-stretch gap-2">
                    <span class="self-stretch text-gray-900 text-sm font-medium">HEADERS</span>
                    <div class="flex justify-center items-start self-stretch flex-1 p-4 rounded-xl bg-gray-900">
                        <p class="flex-1 text-gray-50 text-sm font-medium">
                            {'{'}<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;"Content-Type": "application/json"<br>
                            {'}'}
                        </p>
                    </div>
                </div>
                <div class="flex flex-col items-start self-stretch gap-2">
                    <span class="self-stretch text-gray-900 text-sm font-medium">REQUEST</span>
                    <div class="flex justify-center items-start self-stretch flex-1 p-4 rounded-xl border border-gray-200 bg-white">
                        <p class="flex-1 text-gray-700 text-sm font-medium">
                            {'{'}<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;"username": "client@epushagency.com",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;"password": "password"<br>
                            {'}'}
                        </p>
                    </div>
                </div>
                <div class="flex flex-col items-start self-stretch gap-2">
                    <span class="self-stretch text-gray-900 text-sm font-medium">RESPONSE</span>
                    <div class="flex justify-center items-start self-stretch flex-1 p-4 rounded-xl border border-gray-200 bg-white">
                        <p class="flex-1 text-gray-700 text-sm font-medium">
                            {'{'}<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;"success": true,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;"status": 200,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;"message": "OK",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;"data": {'{'}<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"user": {'{'}<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": 407,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"first_name": "Ahmed",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"last_name": "Abu Al-Saud",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"full_name": "Ahmed Abu Al-Saud",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"username": "super-admin@epushagency.com",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"phone": "01116999840",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"email": "ahmed.m.abualsaud@gmail.com",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"address": "مشروع داون تاون ق34 - المنطقه الترفيهيه - الشروق / sendme73@yahoo.com",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"enabled": true,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"avatar": "http://localhost:8000/storage/avatars/super-admin@epushagency.com-avatar.png",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"created_at": "2024-01-09T22:25:59.000000Z",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"updated_at": "2024-01-09T22:25:59.000000Z"<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'},'}<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"roles": {'['}<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'{'}<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": 1,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "super_admin"<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'],'}<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL2F1dGgvdXNlci9zaWduaW4iLC<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;JpYXQiOjE3MDg3MjYzNzIsImV4cCI6MTcwODcyOTk3MiwibmJmIjoxNzA4NzI2MzcyLCJqdGkiOiJEWWxoNTcxZElheXRhS3FsIiwic3ViIj<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;oiNDA3IiwicHJ2IjoiZGYzZWVjMzRkNzFiNDc2NDJhYzc5ZDNmZjI2NDRiY2RhZDA0ZjJjMyJ9.GLzifsVmSYSnyymLBYWjYi1cFAyLxtviEePDfgMpDhE"<br>
                            <br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL2F1dGgvdXNlci9zaW<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;YXQiOjE3MDg3MjYzNzIsImV4cCI6MTcwODcyOTk3MiwibmJmIjoxNzA4NzI2MzcyLCJqdGkiOiJWaHZZaXFFWXhZeXpkZVdvIiwic3ViIjoiNDA3<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;IiwicHJ2IjoiZGYzZWVjMzRkNzFiNDc2NDJhYzc5ZDNmZjI2NDRiY2RhZDA0ZjJjMyJ9._upl3e-bWGq6J-TeVkwh_T1akiHy0VuAwCe-z5q5uso"<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br>
                            {'}'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        {/if}

        {#if selectedTab == "concepts"}
        <div class="flex flex-col flex-1 items-start gap-4">
            <span class="self-stretch text-gray-900 font-semibold">Concepts</span>
            <p class="self-stretch text-gray-600 text-sm">
                In order to effectively utilize our APIs without encountering any difficulties, it is essential 
                to grasp several key concepts associated with our application. These concepts include:
            </p>
            <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <span class="self-stretch text-gray-600 font-medium">1. Recipients:</span>
                    <p class="self-stretch text-gray-600 text-sm ps-8">
                        Recipients refer to the individuals who will receive your messages through our application. 
                        Each recipient must possess a valid phone number. As a system, we assign a message status to each 
                        recipient to facilitate tracking of the message's delivery status. Initially, when a recipient is 
                        added to our database, their status is set to "Initiated." Once the message is sent from our application 
                        to the GSM networks, this status is updated to "Sent." Finally, upon confirmation of the message's 
                        receipt by the GSM networks, the status is further updated to "Received"
                    </p>
                </div>
                <div class="flex flex-col gap-1">
                    <span class="self-stretch text-gray-600 font-medium">2. Segments:</span>
                    <p class="self-stretch text-gray-600 text-sm ps-8">
                        Messages are divided into multiple segments, with the number of segments dependent on the language 
                        of the message. For instance, if the message is in English and exceeds 160 characters, it is split into 
                        segments, each containing 153 characters. On the other hand, if the message is in Arabic and surpasses 
                        75 characters, it is divided into segments, each consisting of 70 characters. It's important to note that 
                        the newline character "\n" is treated as two characters in this segmentation process.
                    </p>
                </div>
                <div class="flex flex-col gap-1">
                    <span class="self-stretch text-gray-600 font-medium">3. Groups:</span>
                    <p class="self-stretch text-gray-600 text-sm ps-8">
                        We store each message recipients as a group in our database. There are two types of groups:
                        <br>
                        a{')'} Saved Groups:<br>
                        <span class="inline-block self-stretch text-gray-600 text-sm ps-8">
                            These groups are created by you when sending the message, allowing you to assign a specific name 
                            to them for identification and organization purposes.
                        </span>
                        <br>
                        b{')'} Group Logs:<br>
                        <span class=" inline-block self-stretch text-gray-600 text-sm ps-8">
                            Group Logs follow a naming convention in the format "group-{'{key}'}." These groups serve as temporary 
                            records and can be converted into Saved Groups by assigning them a name of your choice.
                        </span>
                    </p>
                </div>
                <p class="self-stretch text-gray-600 text-sm">
                    By comprehending these fundamental concepts, you will be well-equipped to harness the full potential of our APIs 
                    and seamlessly navigate our application's functionalities.
                </p>
            </div>
        </div>
        {/if}

        {#if selectedTab == "send-sms"}
        <div class="flex flex-col items-start self-stretch gap-10">
            <div class="flex flex-col flex-1 items-start gap-4">
                <span class="self-stretch text-gray-900 font-semibold">Send SMS</span>
                <span class="self-stretch text-gray-600 text-sm">
                    The SMS service provider API facilitates the transmission of text messages through a designated endpoint: 
                    POST http://localhost:8000/api/message/send. To interact with this API, users must include specific headers 
                    in their requests. These headers typically consist of "Content-Type" set to "application/json" and an 
                    "Authorization" token for authentication, which is a bearer token encoded with a secure key.
                </span>
                <span class="self-stretch text-gray-600 text-sm">
                    When crafting a request to this API, users need to provide essential message details such as the message content, 
                    sender identification, language preference, API key for authentication, group name for categorization, and an 
                    array of recipient numbers. This structured JSON request allows for targeted and personalized messaging to multiple 
                    recipients simultaneously.
                </span>
                <span class="self-stretch text-gray-600 text-sm">
                    Upon successful transmission of the message, the API responds with a detailed JSON object. The response includes 
                    a "success" flag indicating the operation's outcome, a status code of 200 denoting success, a standard "message" 
                    field with an "OK" message, and a "data" section containing pertinent information about the sent message.
                </span>
                <span class="self-stretch text-gray-600 text-sm">
                    Within the "data" section of the response, users can find specific details related to the sent message. 
                    This information may include user identification, sender identification, order details, message language 
                    identification, approval status, message content, cost incurred for sending the message, scheduled delivery time, 
                    recipient details, group association for the message, segmentation information for the message content, and status 
                    indicators for each recipient to track the success of the message delivery.
                </span>
                <span class="self-stretch text-gray-600 text-sm">
                    In summary, this SMS service provider API offers a robust and comprehensive solution for businesses and organizations 
                    to efficiently send targeted messages to their audience while providing detailed feedback on the delivery status and 
                    associated information for each message sent.
                </span>
            </div>
            <div class="flex flex-col items-start self-stretch flex-1 gap-8 font-mono">
                <div class="flex flex-col items-start self-stretch flex-1 gap-2">
                    <span class="self-stretch text-gray-900 text-sm font-medium">URL</span>
                    <div class="flex justify-center items-start self-stretch rounded-xl bg-gray-900">
                        <div class="flex flex-col items-start self-stretch p-4 bg-gray-800 rounded-l-xl">
                            <span class="text-gray-300 font-bold text-sm">POST</span>
                        </div>
                        <div class="flex items-start flex-1 p-4">
                            <p class="flex-1 text-gray-50 text-sm font-medium">
                                {config("SERVER_URL") + "/message/send"}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col items-start self-stretch gap-2">
                    <span class="self-stretch text-gray-900 text-sm font-medium">HEADERS</span>
                    <div class="flex justify-center items-start self-stretch flex-1 p-4 rounded-xl bg-gray-900">
                        <p class="flex-1 text-gray-50 text-sm font-medium">
                            {'{'}<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;"Content-Type": "application/json",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;"Authorization": "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL2F1dGgvdXNlci9zaWduaW4iLC<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;JpYXQiOjE3MDg3MjYzNzIsImV4cCI6MTcwODcyOTk3MiwibmJmIjoxNzA4NzI2MzcyLCJqdGkiOiJEWWxoNTcxZElheXRhS3FsIiwic3ViIj<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;oiNDA3IiwicHJ2IjoiZGYzZWVjMzRkNzFiNDc2NDJhYzc5ZDNmZjI2NDRiY2RhZDA0ZjJjMyJ9.GLzifsVmSYSnyymLBYWjYi1cFAyLxtviEePDfgMpDhE"<br>
                            {'}'}
                        </p>
                    </div>
                </div>
                <div class="flex flex-col items-start self-stretch gap-2">
                    <span class="self-stretch text-gray-900 text-sm font-medium">REQUEST</span>
                    <div class="flex justify-center items-start self-stretch flex-1 p-4 rounded-xl border border-gray-200 bg-white">
                        <p class="flex-1 text-gray-700 text-sm font-medium">
                            {'{'}<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;"message": "Hello every one",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;"sender": "Ahmedov ORG",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;"language": "English",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;"api_key": "epush-v1.0-1702933754759-accdc39b52596818-a5abb1500bdeaef41e2edd598c015edf",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;"group_name": "Important Group",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;"numbers": {'['}<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"201126999840",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"201147485440"<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;{']'}<br>
                            {'}'}
                        </p>
                    </div>
                </div>
                <div class="flex flex-col items-start self-stretch gap-2">
                    <span class="self-stretch text-gray-900 text-sm font-medium">RESPONSE</span>
                    <div class="flex justify-center items-start self-stretch flex-1 p-4 rounded-xl border border-gray-200 bg-white">
                        <p class="flex-1 text-gray-700 text-sm font-medium">
                            {'{'}
                            <br>
                            &nbsp;&nbsp;&nbsp;&nbsp;"success": true,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;"status": 200,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;"message": "OK",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;"data": {'{'}
                            <br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"message": {'{'}
                            <br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"user_id": 2467,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"sender_id": 21,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"order_id": 16,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"message_language_id": 2,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"approved": true,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"content": "Hello every one",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"notes": null,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"single_message_cost": "0.15",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"total_cost": 0.15,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"scheduled_at": "2024-02-23 22:59:36",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"sent": true,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"number_of_segments": 1,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"number_of_recipients": 1,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"sender_ip": "127.0.0.1",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"message_type": "API",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"updated_at": "2024-02-23T22:59:36.000000Z",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"created_at": "2024-02-23T22:59:36.000000Z",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": 96<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'}'}
                            ,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"group": {'{'}<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": 42,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"user_id": 2467,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "Important Group",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"saved": 0,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"number_of_recipients": 1,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"created_at": "2024-02-23T22:59:36.000000Z",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"updated_at": "2024-02-23T22:59:36.000000Z"<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'}'},
                            <br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"segments": {'['}<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'{'}<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": 81,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"message_id": 96,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"segment_number": 1,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"segment_content": "Hello every one",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"created_at": "2024-02-23T22:59:36.000000Z",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"updated_at": "2024-02-23T22:59:36.000000Z"<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'}'},<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{']'},
                            <br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"recipients": {'['}<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'{'}<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": 142187,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"message_id": 96,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"status": "Sent",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"number": "201126999840",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"attributes": null,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"created_at": "2024-02-23T22:59:36.000000Z",<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"updated_at": "2024-02-23T22:59:36.000000Z"<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'}'},<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{']'}<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br>
                            {'}'}
                    </div>
                </div>
            </div>
        </div>
        {/if}

        {#if selectedTab == "groups"}
        <div class="flex flex-col flex-1 items-start gap-4">
            <span class="self-stretch text-gray-900 font-semibold">Groups</span>
            <span class="self-stretch text-gray-600 text-sm">The Stripe API is organized around REST. Our API has predictable resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.
                You can use the Stripe API in test mode, which doesn’t affect your live data or interact with the banking networks. The API key you use to authenticate the request determines whether the request is live mode or test mode.
                The Stripe API doesn’t support bulk updates. You can work on only one object per request</span>
        </div>
        {/if}

        {#if selectedTab == "integrations"}
        <div class="flex flex-col flex-1 items-start gap-4">
            <span class="self-stretch text-gray-900 font-semibold">Integrations</span>
            <div class="flex flex-col self-stretch gap-5">
                <div class="flex flex-col gap-2">
                    <span class="self-stretch text-gray-600 font-medium">Python</span>
                    <div class="relative self-stretch text-white text-sm ps-8 bg-gray-900 py-4 rounded-xl">
                        <button on:click={copyPythonToClipboard} class="flex justify-center gap-2 absolute top-4 right-4 border border-white py-2 px-3 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <g clip-path="url(#clip0_1012_6221)">
                                  <path d="M8.74984 1.66835C8.1873 1.67597 7.84959 1.70854 7.57652 1.84767C7.26292 2.00746 7.00795 2.26243 6.84816 2.57603C6.70903 2.8491 6.67646 3.18681 6.66883 3.74935M16.2498 1.66835C16.8124 1.67597 17.1501 1.70854 17.4232 1.84767C17.7368 2.00746 17.9917 2.26243 18.1515 2.57603C18.2906 2.8491 18.3232 3.1868 18.3308 3.74934M18.3308 11.2493C18.3232 11.8119 18.2907 12.1496 18.1515 12.4227C17.9917 12.7363 17.7368 12.9912 17.4232 13.151C17.1501 13.2902 16.8124 13.3227 16.2498 13.3304M18.3332 6.66601V8.33268M11.6665 1.66602H13.3331M4.33317 18.3327H10.6665C11.5999 18.3327 12.0666 18.3327 12.4232 18.151C12.7368 17.9912 12.9917 17.7363 13.1515 17.4227C13.3332 17.0661 13.3332 16.5994 13.3332 15.666V9.33268C13.3332 8.39926 13.3332 7.93255 13.1515 7.57603C12.9917 7.26243 12.7368 7.00746 12.4232 6.84767C12.0666 6.66602 11.5999 6.66602 10.6665 6.66602H4.33317C3.39975 6.66602 2.93304 6.66602 2.57652 6.84767C2.26292 7.00746 2.00795 7.26243 1.84816 7.57603C1.6665 7.93255 1.6665 8.39926 1.6665 9.33268V15.666C1.6665 16.5994 1.6665 17.0661 1.84816 17.4227C2.00795 17.7363 2.26292 17.9912 2.57652 18.151C2.93304 18.3327 3.39975 18.3327 4.33317 18.3327Z" stroke="#fff" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                  <clipPath id="clip0_1012_6221">
                                    <rect width="20" height="20" fill="white"/>
                                  </clipPath>
                                </defs>
                            </svg>
                            <span class="text-xs font-medium">Copy</span>
                        </button>
                        <p><span class="text-rose-600">import </span><span class="text-teal-400">requests</span></p>
                        <p><span class="text-rose-600">import </span><span class="text-teal-400">json</span></p>
                        <br>
                        <p class="text-gray-400"># Login endpoint URL</p>
                        <p><span class="text-sky-400">url </span> = <span class=" text-amber-500">'{config("SERVER_URL") + '/auth/user/signin'}'</span></p>
                        <br>
                        <p class="text-gray-400"># Request headers</p>
                        <p><span class="text-sky-400">headers </span><span> = </span><span class="text-amber-200">{'{'}</span></p>
                        <p class="ps-8"><span class="text-amber-500">'Content-Type'</span> : <span class="text-amber-500">'application/json'</span></p>
                        <p><span class="text-amber-200">{'}'}</span></p>
                        <br>
                        <p class="text-gray-400"># Request body</p>
                        <p><span class="text-sky-400">payload </span><span> = </span><span class="text-amber-200">{'{'}</span></p>
                        <p class="ps-8"><span class="text-amber-500">'username'</span> : <span class="text-amber-500">'client@epushagency.com'</span> ,</p>
                        <p class="ps-8"><span class="text-amber-500">'password'</span> : <span class="text-amber-500">'password'</span></p>
                        <p><span class="text-amber-200">{'}'}</span></p>
                        <br>
                        <p class="text-gray-400"># Sending the POST request</p>
                        <p><span class="text-sky-400">response </span> = <span class=" text-teal-400">requests</span>.<span class="text-amber-200">post</span><span class="text-orange-400">(</span><span class="text-sky-400">url</span>, <span class="text-sky-400">headers</span>=<span class="text-sky-400">headers</span>, <span class="text-sky-400">data</span>=<span class="text-teal-400">json</span>.<span class="text-amber-200">dumps</span><span class="text-violet-500">(</span><span class="text-sky-400">payload</span><span class="text-violet-500">)</span><span class="text-orange-400">)</span></p>
                        <br>
                        <p class="text-gray-400"># Check for errors</p>
                        <p><span class="text-rose-600">if</span> <span class="text-sky-400">response</span>.<span class="text-sky-400">status_code</span> != <span class="text-green-200">200</span> :</p>
                        <p class="ps-8"><span class="text-amber-200"> print</span><span class="text-orange-400">(</span><span class="text-amber-500">'Failed to make the request. Status code:' </span>, <span class="text-sky-400">response</span>.<span class="text-sky-400">status_code</span><span class="text-orange-400">)</span></p>
                        <p><span class="text-rose-600">else</span>:</p>
                        <p class="ps-8"><span class="text-sky-400">response_data</span> = <span class="text-sky-400">response</span>.<span class="text-amber-200">json</span><span class="text-orange-400">()</span></p>
                        <p class="ps-8"><span class="text-sky-400">access_token</span> = <span class="text-sky-400">response_data</span>.<span class="text-sky-400">data</span>.<span class="text-sky-400">access_token</span></p>
                        <br>
                        <p class="text-gray-400 ps-8"># Send Message URL</p>
                        <p class="ps-8"><span class="text-sky-400">url </span> = <span class=" text-amber-500">'{config("SERVER_URL") + '/message/send'}'</span></p>
                        <br>
                        <p class="text-gray-400 ps-8"># Request headers</p>
                        <p class="ps-8"><span class="text-sky-400">headers </span><span> = </span><span class="text-amber-200">{'{'}</span></p>
                        <p class="ps-16"><span class="text-amber-500">'Content-Type'</span> : <span class="text-amber-500">'application/json'</span> ,</p>
                        <p class="ps-16"><span class="text-amber-500">'Authorization'</span> : <span class="text-amber-500">'bearer '</span> + <span class="text-sky-400">access_token</span></p>
                        <p class="ps-8"><span class="text-amber-200">{'}'}</span></p>
                        <br>
                        <p class="text-gray-400 ps-8"># Request body</p>
                        <p class="ps-8"><span class="text-sky-400">payload </span><span> = </span><span class="text-amber-200">{'{'}</span></p>
                        <p class="ps-16"><span class="text-amber-500">'message'</span> : <span class="text-amber-500">'Hello every one'</span> ,</p>
                        <p class="ps-16"><span class="text-amber-500">'sender'</span> : <span class="text-amber-500">'Ahmed ORG'</span> ,</p>
                        <p class="ps-16"><span class="text-amber-500">'language'</span> : <span class="text-amber-500">'English'</span> ,</p>
                        <p class="ps-16"><span class="text-amber-500">'api_key'</span> : <span class="text-amber-500">'epush-v1.0-1702933754759-accdc39b52596818-a5abb1500bdeaef41e2edd598c015edf'</span> ,</p>
                        <p class="ps-16"><span class="text-amber-500">'group_name'</span> : <span class="text-amber-500">'Important Group'</span> ,</p>
                        <p class="ps-16"><span class="text-amber-500">'number'</span> : <span class="text-violet-400">[</span></p>
                        <p class="ps-24"><span class="text-amber-500">'201126999840'</span> ,</p>
                        <p class="ps-24"><span class="text-amber-500">'201147485440'</span></p>
                        <p class="ps-16"><span class="text-violet-400">]</span></p>
                        <p class="ps-8"><span class="text-amber-200">{'}'}</span></p>
                        <br>
                        <p class="text-gray-400 ps-8"># Sending the POST request</p>
                        <p class="ps-8"><span class="text-sky-400">response </span> = <span class=" text-teal-400">requests</span>.<span class="text-amber-200">post</span><span class="text-orange-400">(</span><span class="text-sky-400">url</span>, <span class="text-sky-400">headers</span>=<span class="text-sky-400">headers</span>, <span class="text-sky-400">data</span>=<span class="text-teal-400">json</span>.<span class="text-amber-200">dumps</span><span class="text-violet-500">(</span><span class="text-sky-400">payload</span><span class="text-violet-500">)</span><span class="text-orange-400">)</span></p>
                        <br>
                        <p class="text-gray-400 ps-8"># Check for errors</p>
                        <p class="ps-8"><span class="text-rose-600">if</span> <span class="text-sky-400">response</span>.<span class="text-sky-400">status_code</span> != <span class="text-green-200">200</span> :</p>
                        <p class="ps-16"><span class="text-amber-200"> print</span><span class="text-orange-400">(</span><span class="text-amber-500">'Failed to make the request. Status code:' </span>, <span class="text-sky-400">response</span>.<span class="text-sky-400">status_code</span><span class="text-orange-400">)</span></p>
                        <p class="ps-8"><span class="text-rose-600">else</span>:</p>
                        <p class="text-gray-400 ps-16"># Handle the response</p>
                        <p class="ps-16"><span class="text-sky-400">response_data</span> = <span class="text-sky-400">response</span>.<span class="text-amber-200">json</span><span class="text-orange-400">()</span></p>
                        <br>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <span class="self-stretch text-gray-600 font-medium">PHP</span>
                    <div class="relative self-stretch text-white text-sm ps-8 bg-gray-900 py-4 rounded-xl">
                        <button on:click={copyPHPToClipboard} class="flex justify-center gap-2 absolute top-4 right-4 border border-white py-2 px-3 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <g clip-path="url(#clip0_1012_6221)">
                                  <path d="M8.74984 1.66835C8.1873 1.67597 7.84959 1.70854 7.57652 1.84767C7.26292 2.00746 7.00795 2.26243 6.84816 2.57603C6.70903 2.8491 6.67646 3.18681 6.66883 3.74935M16.2498 1.66835C16.8124 1.67597 17.1501 1.70854 17.4232 1.84767C17.7368 2.00746 17.9917 2.26243 18.1515 2.57603C18.2906 2.8491 18.3232 3.1868 18.3308 3.74934M18.3308 11.2493C18.3232 11.8119 18.2907 12.1496 18.1515 12.4227C17.9917 12.7363 17.7368 12.9912 17.4232 13.151C17.1501 13.2902 16.8124 13.3227 16.2498 13.3304M18.3332 6.66601V8.33268M11.6665 1.66602H13.3331M4.33317 18.3327H10.6665C11.5999 18.3327 12.0666 18.3327 12.4232 18.151C12.7368 17.9912 12.9917 17.7363 13.1515 17.4227C13.3332 17.0661 13.3332 16.5994 13.3332 15.666V9.33268C13.3332 8.39926 13.3332 7.93255 13.1515 7.57603C12.9917 7.26243 12.7368 7.00746 12.4232 6.84767C12.0666 6.66602 11.5999 6.66602 10.6665 6.66602H4.33317C3.39975 6.66602 2.93304 6.66602 2.57652 6.84767C2.26292 7.00746 2.00795 7.26243 1.84816 7.57603C1.6665 7.93255 1.6665 8.39926 1.6665 9.33268V15.666C1.6665 16.5994 1.6665 17.0661 1.84816 17.4227C2.00795 17.7363 2.26292 17.9912 2.57652 18.151C2.93304 18.3327 3.39975 18.3327 4.33317 18.3327Z" stroke="#fff" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                  <clipPath id="clip0_1012_6221">
                                    <rect width="20" height="20" fill="white"/>
                                  </clipPath>
                                </defs>
                            </svg>
                            <span class="text-xs font-medium">Copy</span>
                        </button>
                        <p class="text-green-600">// Login endpoint URL</p>
                        <p><span class="text-sky-400">$url </span> = <span class=" text-amber-500">'{config("SERVER_URL") + '/auth/user/signin'}'</span> ;</p>
                        <br>
                        <p class="text-green-600">// Request headers</p>
                        <p><span class="text-sky-400">$headers </span><span> = </span><span class="text-amber-200">array</span><span class="text-indigo-600">&nbsp;(</span></p>
                        <p class="ps-8"><span class="text-amber-500">'Content-Type: application/json'</span></p>
                        <p><span class="text-indigo-600">)</span> ;</p>
                        <br>
                        <p class="text-green-600">// Request body</p>
                        <p><span class="text-sky-400">$data </span><span> = </span><span class="text-amber-200">array</span><span class="text-indigo-600">&nbsp;(</span></p>
                        <p class="ps-8"><span class="text-amber-500">'username'</span> <span>={'>'}</span> <span class="text-amber-500">'client@epushagency.com'</span>,</p>
                        <p class="ps-8"><span class="text-amber-500">'password'</span> <span>={'>'}</span> <span class="text-amber-500">'password'</span>,</p>
                        <p><span class="text-indigo-600">)</span> ;</p>
                        <br>
                        <p class="text-green-600">// Initialize cURL session</p>
                        <p><span class="text-sky-400">$ch </span> = <span class=" text-amber-200">curl_init</span><span class="text-indigo-600">()</span> ;</p>
                        <br>
                        <p class="text-green-600">// Set cURL options</p>
                        <p><span class="text-amber-200">curl_setopt</span><span class="text-indigo-600">(</span><span class="text-sky-400">$ch</span>, CURLOPT_URL, <span class="text-sky-400">$url</span><span class="text-indigo-600">)</span> ;</p>
                        <p><span class="text-amber-200">curl_setopt</span><span class="text-indigo-600">(</span><span class="text-sky-400">$ch</span>, CURLOPT_POST, <span class="text-sky-400">1</span><span class="text-indigo-600">)</span> ;</p>
                        <p><span class="text-amber-200">curl_setopt</span><span class="text-indigo-600">(</span><span class="text-sky-400">$ch</span>, CURLOPT_POSTFIELDS, <span class="text-amber-200">json_encode</span><span class="text-violet-500">(</span><span class="text-sky-400">$data</span><span class="text-violet-500">)</span><span class="text-indigo-600">)</span> ;</p>
                        <p><span class="text-amber-200">curl_setopt</span><span class="text-indigo-600">(</span><span class="text-sky-400">$ch</span>, CURLOPT_HTTPHEADER, <span class="text-sky-400">$headers</span><span class="text-indigo-600">)</span> ;</p>
                        <p><span class="text-amber-200">curl_setopt</span><span class="text-indigo-600">(</span><span class="text-sky-400">$ch</span>, CURLOPT_RETURNTRANSFER, <span class="text-sky-400">true</span><span class="text-indigo-600">)</span> ;</p>
                        <br>
                        <p class="text-green-600">// Execute the cURL session</p>
                        <p><span class="text-sky-400">$response </span> = <span class=" text-amber-200">curl_exec</span><span class="text-indigo-600">(</span><span class="text-sky-400">$ch</span><span class="text-indigo-600">)</span> ;</p>
                        <br>
                        <p class="text-green-600">// Check for errors</p>
                        <p><span class="text-violet-500">if</span> <span class="text-indigo-600">(</span><span class="text-sky-400">$response</span> === <span class="text-sky-400">false</span><span class="text-indigo-600">)</span> {'{'}</p>
                        <p class="ps-8"><span class="text-violet-500">echo</span> <span class="text-amber-500">'cURL error: '</span> . <span class="text-amber-200">curl_error</span><span class="text-indigo-600">(</span><span class="text-sky-400">$ch</span><span class="text-indigo-600">)</span> ;</p>
                        <p>{'}'}</p>
                        <br>
                        <p class="text-green-600">// Close cURL session</p>
                        <p><span class=" text-amber-200">curl_close</span><span class="text-indigo-600">(</span><span class="text-sky-400">$ch</span><span class="text-indigo-600">)</span> ;</p>
                        <br>
                        <p class="text-green-600">// Get access token</p>
                        <p><span class="text-sky-400">$access_token</span> = <span class="text-sky-400">$response</span><span class="text-amber-200">[</span><span class="text-amber-500">'data'</span><span class="text-amber-200">]</span><span class="text-amber-200">[</span><span class="text-amber-500">'access_token'</span><span class="text-amber-200">]</span>;</p>
                        <br>
                        <br>
                        <br>
                        <p class="text-green-600">// Send Message URL</p>
                        <p><span class="text-sky-400">$url </span> = <span class=" text-amber-500">'{config("SERVER_URL") + '/message/send'}'</span> ;</p>
                        <br>
                        <p class="text-green-600">// Request headers</p>
                        <p><span class="text-sky-400">$headers </span><span> = </span><span class="text-amber-200">array</span><span class="text-indigo-600">&nbsp;(</span></p>
                        <p class="ps-8"><span class="text-amber-500">'Content-Type: application/json'</span> ,</p>
                        <p class="ps-8"><span class="text-amber-500">'Authorization: bearer ' .</span> <span class="text-sky-400">$access_token</span></p>
                        <p><span class="text-indigo-600">)</span> ;</p>
                        <br>
                        <p class="text-green-600">// Request body</p>
                        <p><span class="text-sky-400">$data </span><span> = </span><span class="text-amber-200">array</span><span class="text-indigo-600">&nbsp;(</span></p>
                        <p class="ps-8"><span class="text-amber-500">'message'</span> <span>={'>'}</span> <span class="text-amber-500">'Hello every one'</span>,</p>
                        <p class="ps-8"><span class="text-amber-500">'sender'</span> <span>={'>'}</span> <span class="text-amber-500">'Ahmed ORG'</span>,</p>
                        <p class="ps-8"><span class="text-amber-500">'language'</span> <span>={'>'}</span> <span class="text-amber-500">'English'</span>,</p>
                        <p class="ps-8"><span class="text-amber-500">'api_key'</span> <span>={'>'}</span> <span class="text-amber-500">'epush-v1.0-1702933754759-accdc39b52596818-a5abb1500bdeaef41e2edd598c015edf'</span>,</p>
                        <p class="ps-8"><span class="text-amber-500">'group_name'</span> <span>={'>'}</span> <span class="text-amber-500">'Important Group'</span>,</p>
                        <p class="ps-8"><span class="text-amber-500">'numbers'</span> <span>={'>'}</span> <span class="text-amber-200">[</span></p>
                        <p class="ps-16"><span class="text-amber-500">'201126999840'</span> ,</p>
                        <p class="ps-16"><span class="text-amber-500">'201147485440'</span></p>
                        <p class="ps-8"><span class="text-amber-200">]</span></p>
                        <p><span class="text-indigo-600">)</span> ;</p>
                        <br>
                        <p class="text-green-600">// Initialize cURL session</p>
                        <p><span class="text-sky-400">$ch </span> = <span class=" text-amber-200">curl_init</span><span class="text-indigo-600">()</span> ;</p>
                        <br>
                        <p class="text-green-600">// Set cURL options</p>
                        <p><span class="text-amber-200">curl_setopt</span><span class="text-indigo-600">(</span><span class="text-sky-400">$ch</span>, CURLOPT_URL, <span class="text-sky-400">$url</span><span class="text-indigo-600">)</span> ;</p>
                        <p><span class="text-amber-200">curl_setopt</span><span class="text-indigo-600">(</span><span class="text-sky-400">$ch</span>, CURLOPT_POST, <span class="text-sky-400">1</span><span class="text-indigo-600">)</span> ;</p>
                        <p><span class="text-amber-200">curl_setopt</span><span class="text-indigo-600">(</span><span class="text-sky-400">$ch</span>, CURLOPT_POSTFIELDS, <span class="text-amber-200">json_encode</span><span class="text-violet-500">(</span><span class="text-sky-400">$data</span><span class="text-violet-500">)</span><span class="text-indigo-600">)</span> ;</p>
                        <p><span class="text-amber-200">curl_setopt</span><span class="text-indigo-600">(</span><span class="text-sky-400">$ch</span>, CURLOPT_HTTPHEADER, <span class="text-sky-400">$headers</span><span class="text-indigo-600">)</span> ;</p>
                        <p><span class="text-amber-200">curl_setopt</span><span class="text-indigo-600">(</span><span class="text-sky-400">$ch</span>, CURLOPT_RETURNTRANSFER, <span class="text-sky-400">true</span><span class="text-indigo-600">)</span> ;</p>
                        <br>
                        <p class="text-green-600">// Execute the cURL session</p>
                        <p><span class="text-sky-400">$response </span> = <span class=" text-amber-200">curl_exec</span><span class="text-indigo-600">(</span><span class="text-sky-400">$ch</span><span class="text-indigo-600">)</span> ;</p>
                        <br>
                        <p class="text-green-600">// Check for errors</p>
                        <p><span class="text-violet-500">if</span> <span class="text-indigo-600">(</span><span class="text-sky-400">$response</span> === <span class="text-sky-400">false</span><span class="text-indigo-600">)</span> {'{'}</p>
                        <p class="ps-8"><span class="text-violet-500">echo</span> <span class="text-amber-500">'cURL error: '</span> . <span class="text-amber-200">curl_error</span><span class="text-indigo-600">(</span><span class="text-sky-400">$ch</span><span class="text-indigo-600">)</span> ;</p>
                        <p>{'}'}</p>
                        <br>
                        <p class="text-green-600">// Close cURL session</p>
                        <p><span class=" text-amber-200">curl_close</span><span class="text-indigo-600">(</span><span class="text-sky-400">$ch</span><span class="text-indigo-600">)</span> ;</p>
                        <br>
                        <p class="text-green-600">// Handle the response</p>
                        <p><span class="text-violet-500">echo</span> <span class="text-sky-400">$response</span>;</p>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <span class="self-stretch text-gray-600 font-medium">C#</span>
                    <div class="relative self-stretch text-white text-sm ps-8 bg-gray-900 py-4 rounded-xl">
                        <button on:click={copyDotNetToClipboard} class="flex justify-center gap-2 absolute top-4 right-4 border border-white py-2 px-3 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <g clip-path="url(#clip0_1012_6221)">
                                  <path d="M8.74984 1.66835C8.1873 1.67597 7.84959 1.70854 7.57652 1.84767C7.26292 2.00746 7.00795 2.26243 6.84816 2.57603C6.70903 2.8491 6.67646 3.18681 6.66883 3.74935M16.2498 1.66835C16.8124 1.67597 17.1501 1.70854 17.4232 1.84767C17.7368 2.00746 17.9917 2.26243 18.1515 2.57603C18.2906 2.8491 18.3232 3.1868 18.3308 3.74934M18.3308 11.2493C18.3232 11.8119 18.2907 12.1496 18.1515 12.4227C17.9917 12.7363 17.7368 12.9912 17.4232 13.151C17.1501 13.2902 16.8124 13.3227 16.2498 13.3304M18.3332 6.66601V8.33268M11.6665 1.66602H13.3331M4.33317 18.3327H10.6665C11.5999 18.3327 12.0666 18.3327 12.4232 18.151C12.7368 17.9912 12.9917 17.7363 13.1515 17.4227C13.3332 17.0661 13.3332 16.5994 13.3332 15.666V9.33268C13.3332 8.39926 13.3332 7.93255 13.1515 7.57603C12.9917 7.26243 12.7368 7.00746 12.4232 6.84767C12.0666 6.66602 11.5999 6.66602 10.6665 6.66602H4.33317C3.39975 6.66602 2.93304 6.66602 2.57652 6.84767C2.26292 7.00746 2.00795 7.26243 1.84816 7.57603C1.6665 7.93255 1.6665 8.39926 1.6665 9.33268V15.666C1.6665 16.5994 1.6665 17.0661 1.84816 17.4227C2.00795 17.7363 2.26292 17.9912 2.57652 18.151C2.93304 18.3327 3.39975 18.3327 4.33317 18.3327Z" stroke="#fff" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                  <clipPath id="clip0_1012_6221">
                                    <rect width="20" height="20" fill="white"/>
                                  </clipPath>
                                </defs>
                            </svg>
                            <span class="text-xs font-medium">Copy</span>
                        </button>
                        <p class="text-green-600">// API endpoint URL</p>
                        <p><span class="text-blue-600">string</span> <span class="text-sky-400">url </span> = <span class="text-amber-500">'{config("SERVER_URL") + '/auth/user/signin'}'</span> ;</p>
                        <br>
                        <p class="text-green-600">// Request headers</p>
                        <p><span class="text-blue-600">var</span> <span class="text-sky-400">headers </span> = <span class="text-blue-600">new</span> <span class="text-teal-500">Dictionary</span>{'<'}<span class="text-blue-600">string</span>, <span class="text-blue-600">string</span>{'>'}<span class="text-orange-600">()</span> ;</p>
                        <p><span class="text-sky-400">headers</span>.<span class="text-amber-200">Add</span><span class="text-orange-600">(</span><span class="text-amber-500">'Content-Type'</span>, <span class="text-amber-500">'application/json'</span><span class="text-orange-600">)</span> ;</p>
                        <br>
                        <p class="text-green-600">// Request body</p>
                        <p><span class=" text-blue-600">var</span> <span class="text-sky-400">data </span><span> = </span><span class="text-blue-600">new</span> <span class="text-orange-600">{'{'}</span></p>
                        <p class="ps-8"><span class="text-sky-400">username</span> = <span class="text-amber-500">'client@epushagency.com'</span>,</p>
                        <p class="ps-8"><span class="text-sky-400">password</span> = <span class="text-amber-500">'password'</span></p>
                        <p><span class="text-orange-600">{'}'}</span> ;</p>
                        <br>
                        <p class="text-green-600">// Initialize HttpClient</p>
                        <p><span class="text-purple-500">using</span> <span class="text-orange-600">(</span><span class="text-blue-600">var</span> <span class="text-sky-400">client</span> = <span class="text-blue-600">new</span> <span class="text-teal-500">HttpClient</span><span class="text-indigo-600">()</span><span class="text-orange-600">)</span></p>
                        <p><span class="text-orange-600">{"{"}</span></p>
                        <p class="ps-8 text-green-600">// Set request headers</p>
                        <p class="ps-8"><span class="text-purple-500">foreach</span> <span class="text-orange-600">(</span><span class="text-blue-600">var</span> <span class="text-sky-400">header</span> <span class="text-purple-500">in</span> <span class="text-sky-400">headers</span><span class="text-orange-600">)</span></p>
                        <p class="ps-8"><span class="text-orange-600">{'{'}</span></p>
                        <p class="ps-16"><span class="text-sky-400">client</span>.<span class="text-sky-400">DefaultRequestHeaders</span>.<span class="text-amber-200">Add</span><span class="text-orange-600">(</span><span class="text-sky-400">header</span>.<span class="text-sky-400">key</span>, <span class="text-sky-400">header</span>.<span class="text-sky-400">value</span><span class="text-orange-600">)</span> ;</p>
                        <p class="ps-8"><span class="text-orange-600">{'}'}</span></p>
                        <br>
                        <p class="ps-8 text-green-600">// Execute the POST request</p>
                        <p class="ps-8"><span class="text-blue-600">var</span> <span class="text-sky-400">response</span> = <span class="text-blue-600">await</span> <span class="text-sky-400">client</span>.<span class="text-amber-200">PostAsync</span><span class="text-orange-600">(</span><span class="text-sky-400">url</span>, <span class="text-blue-600">new</span> <span class="text-teal-500">StringContent</span><span class="text-violet-600">(</span><span class="text-sky-400">JsonConvert</span>.<span class="text-amber-200">SerializeObject</span><span class="text-rose-600">(</span><span class="text-sky-400">data</span><span class="text-rose-600">)</span>, <span class="text-sky-400">Encoding</span>.<span class="text-sky-400">UTF8</span>, <span class="text-amber-500">"application/json"</span><span class="text-violet-600">)</span><span class="text-orange-600">)</span> ;</p>
                        <br>
                        <p class="ps-8 text-green-600">// Check for errors</p>
                        <p class="ps-8"><span class="text-purple-500">if</span> <span class="text-orange-600">(</span>! <span class="text-sky-400">response</span>.<span class="text-sky-400">IsSuccessStatusCode</span><span class="text-orange-600">)</span></p>
                        <p class="ps-8"><span class="text-orange-600">{'{'}</span></p>
                        <p class="ps-16"><span class="text-sky-400">Console</span>.<span class="text-amber-200">WriteLine</span><span class="text-orange-600">(</span><span class="text-amber-500">"HTTP error: "</span> + <span class="text-sky-400">response</span>.<span class="text-sky-400">StatusCode</span><span class="text-orange-600">)</span> ;</p>
                        <p class="ps-8"><span class="text-orange-600">{'}'}</span></p>
                        <p class="ps-8"><span class="text-purple-500">else</span></p>
                        <p class="ps-8"><span class="text-orange-600">{'{'}</span></p>
                        <p class="ps-16 text-green-600">// Get access token</p>
                        <p class="ps-16"><span class="text-blue-600">var</span> <span class="text-sky-400">content</span> = <span class="text-blue-600">await</span> <span class="text-sky-400">response</span>.<span class="text-sky-400">Content</span>.<span class="text-amber-200">ReadAsStringAsync</span><span class="text-violet-500">(</span><span class="text-violet-500">)</span> ;</p>
                        <p class="ps-16"><span class="text-blue-600">var</span> <span class="text-sky-400">result</span> = <span class="text-sky-400">JsonConvert</span>.<span class="text-amber-200">DeserializeObject</span>{'<'}<span class="text-blue-600">dynamic</span>{'>'}<span class="text-violet-500">(</span><span class="text-sky-400">content</span><span class="text-violet-500">)</span> ;</p>
                        <p class="ps-16"><span class="text-blue-600">string</span> <span class="text-sky-400">access_token</span> = <span class="text-sky-400">result</span>.<span class="text-sky-400">data</span>.<span class="text-sky-400">access_token</span> ;</p>
                        <br>
                        <p class="ps-16 text-green-600">// Send Message URL</p>
                        <p class="ps-16"><span class="text-blue-600">string</span> <span class="text-sky-400">url </span> = <span class="text-amber-500">'{config("SERVER_URL") + '/message/send'}'</span> ;</p>
                        <br>
                        <p class="ps-16 text-green-600">// Request headers</p>
                        <p class="ps-16"><span class="text-sky-400">headers</span>.<span class="text-amber-200">Add</span><span class="text-orange-600">(</span><span class="text-amber-500">'Authorization'</span>, <span class="text-amber-500">'bearer '</span> + <span class="text-sky-400">access_token</span><span class="text-orange-600">)</span> ;</p>
                        <br>
                        <p class="ps-16 text-green-600">// Request body</p>
                        <p class="ps-16"><span class="text-sky-400">data </span><span> = </span><span class="text-blue-600">new</span> <span class="text-orange-600">{'{'}</span></p>
                        <p class="ps-24"><span class="text-sky-400">message</span> = <span class="text-amber-500">'Hello every one'</span>,</p>
                        <p class="ps-24"><span class="text-sky-400">sender</span> = <span class="text-amber-500">'Ahmed ORG'</span>,</p>
                        <p class="ps-24"><span class="text-sky-400">language</span> = <span class="text-amber-500">'English'</span>,</p>
                        <p class="ps-24"><span class="text-sky-400">api_key</span> = <span class="text-amber-500">'epush-v1.0-1702933754759-accdc39b52596818-a5abb1500bdeaef41e2edd598c015edf'</span>,</p>
                        <p class="ps-24"><span class="text-sky-400">group_name</span> = <span class="text-amber-500">'Important Group'</span>,</p>
                        <p class="ps-24"><span class="text-sky-400">numbers</span> = <span class="text-blue-600">new</span> <span class="text-blue-600">string</span><span class="text-amber-200">[</span><span class="text-amber-200">]</span> <span class="text-violet-500">{'{'}</span></p>
                        <p class="ps-32"><span class="text-amber-500">'201126999840'</span></p>
                        <p class="ps-32"><span class="text-amber-500">'201147485440'</span></p>
                        <p class="ps-24"><span class="text-violet-500">{'}'}</span></p>
                        <p class="ps-16"><span class="text-orange-600">{'}'}</span> ;</p>
                        <br>
                        <p class="ps-16 text-green-600">// Execute the POST request</p>
                        <p class="ps-16"><span class="text-sky-400">response</span> = <span class="text-blue-600">await</span> <span class="text-sky-400">client</span>.<span class="text-amber-200">PostAsync</span><span class="text-orange-600">(</span><span class="text-sky-400">url</span>, <span class="text-blue-600">new</span> <span class="text-teal-500">StringContent</span><span class="text-violet-600">(</span><span class="text-sky-400">JsonConvert</span>.<span class="text-amber-200">SerializeObject</span><span class="text-rose-600">(</span><span class="text-sky-400">data</span><span class="text-rose-600">)</span>, <span class="text-sky-400">Encoding</span>.<span class="text-sky-400">UTF8</span>, <span class="text-amber-500">"application/json"</span><span class="text-violet-600">)</span><span class="text-orange-600">)</span> ;</p>
                        <br>
                        <p class="ps-16 text-green-600">// Check for errors</p>
                        <p class="ps-16"><span class="text-purple-500">if</span> <span class="text-orange-600">(</span>! <span class="text-sky-400">response</span>.<span class="text-sky-400">IsSuccessStatusCode</span><span class="text-orange-600">)</span></p>
                        <p class="ps-16"><span class="text-orange-600">{'{'}</span></p>
                        <p class="ps-24"><span class="text-sky-400">Console</span>.<span class="text-amber-200">WriteLine</span><span class="text-orange-600">(</span><span class="text-amber-500">"HTTP error: "</span> + <span class="text-sky-400">response</span>.<span class="text-sky-400">StatusCode</span><span class="text-orange-600">)</span> ;</p>
                        <p class="ps-16"><span class="text-orange-600">{'}'}</span></p>
                        <p class="ps-16"><span class="text-purple-500">else</span></p>
                        <p class="ps-16"><span class="text-orange-600">{'{'}</span></p>
                        <p class="ps-24 text-green-600">// Handle the response</p>
                        <p class="ps-24"><span class="text-sky-400">content</span> = <span class="text-blue-600">await</span> <span class="text-sky-400">response</span>.<span class="text-sky-400">Content</span>.<span class="text-amber-200">ReadAsStringAsync</span><span class="text-violet-500">(</span><span class="text-violet-500">)</span> ;</p>
                        <p class="ps-16"><span class="text-orange-600">{'}'}</span></p>
                        <p class="ps-8"><span class="text-orange-600">{'}'}</span></p>
                        <p><span class="text-orange-600">{'}'}</span></p>
                    </div>
                </div>
            </div>
        </div>
        {/if}
    </div>
</div>

<div id="html-to-pdf" class="z-[-999999]"></div>