<script>
    import { config } from "$lib/config/app.config"
</script>

<div class="flex flex-col gap-20">

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

    <div class="flex flex-col flex-1 items-start gap-4">
        <span class="self-stretch text-gray-900 font-semibold">Groups</span>
        <span class="self-stretch text-gray-600 text-sm">The Stripe API is organized around REST. Our API has predictable resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.
            You can use the Stripe API in test mode, which doesn’t affect your live data or interact with the banking networks. The API key you use to authenticate the request determines whether the request is live mode or test mode.
            The Stripe API doesn’t support bulk updates. You can work on only one object per request</span>
    </div>

    <div class="flex flex-col flex-1 items-start gap-4">
        <span class="self-stretch text-gray-900 font-semibold">Integrations</span>
        <div class="flex flex-col self-stretch gap-5">
            <div class="flex flex-col gap-2">
                <span class="self-stretch text-gray-600 font-medium">Python</span>
                <div class="relative self-stretch text-white text-sm ps-8 bg-gray-900 py-4 rounded-xl">
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

</div>