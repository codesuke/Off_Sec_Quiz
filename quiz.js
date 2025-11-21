const questions = [
    {
        question: "What does the acronym 'OSINT' stand for in cybersecurity?",
        options: ["Open Source Intelligence", "Operating System Interface", "Offensive Security Intelligence Network", "Online Security Integration Tool"],
        correct: 0
    },
    {
        question: "Which tool is primarily used for network discovery and security auditing?",
        options: ["Wireshark", "Nmap", "Metasploit", "Burp Suite"],
        correct: 1
    },
    {
        question: "What is the primary purpose of a 'reverse shell'?",
        options: ["To encrypt network traffic", "To allow a remote attacker to execute commands on a target system", "To scan for vulnerabilities", "To monitor system logs"],
        correct: 1
    },
    {
        question: "Which of the following is a common SQL injection payload?",
        options: ["<script>alert('XSS')</script>", "' OR '1'='1' --", "../../../etc/passwd", "rm -rf /"],
        correct: 1
    },
    {
        question: "What does 'XSS' stand for in web security?",
        options: ["Cross-Site Scripting", "External Security System", "Cross-Server Synchronization", "eXtended Security Suite"],
        correct: 0
    },
    {
        question: "Which port is typically associated with SSH?",
        options: ["21", "22", "23", "80"],
        correct: 1
    },
    {
        question: "What is the purpose of Metasploit Framework?",
        options: ["Network packet analysis", "Penetration testing and exploit development", "Password cracking", "Web application firewall"],
        correct: 1
    },
    {
        question: "Which technique involves sending malformed packets to crash a system?",
        options: ["Phishing", "Fuzzing", "Spoofing", "Sniffing"],
        correct: 1
    },
    {
        question: "What is 'privilege escalation'?",
        options: ["Gaining higher-level permissions on a system", "Encrypting data", "Creating backdoors", "Scanning networks"],
        correct: 0
    },
    {
        question: "Which tool is commonly used for password cracking?",
        options: ["Nmap", "John the Ripper", "Wireshark", "Nikto"],
        correct: 1
    },
    {
        question: "What does CSRF stand for?",
        options: ["Cross-Site Request Forgery", "Cyber Security Response Force", "Client-Side Remote Function", "Cryptographic Signature Rotation Format"],
        correct: 0
    },
    {
        question: "Which HTTP method is typically NOT idempotent?",
        options: ["GET", "PUT", "DELETE", "POST"],
        correct: 3
    },
    {
        question: "What is the default port for HTTPS?",
        options: ["80", "443", "8080", "8443"],
        correct: 1
    },
    {
        question: "Which vulnerability allows an attacker to include files from the server?",
        options: ["SQLi", "XSS", "LFI (Local File Inclusion)", "CSRF"],
        correct: 2
    },
    {
        question: "What is a 'zero-day' vulnerability?",
        options: ["A vulnerability that takes zero days to exploit", "A vulnerability unknown to the software vendor", "A vulnerability that was patched yesterday", "A vulnerability in legacy systems"],
        correct: 1
    },
    {
        question: "Which protocol is used by Wireshark to capture packets?",
        options: ["TCP", "libpcap/WinPcap", "HTTP", "SSL"],
        correct: 1
    },
    {
        question: "What is the purpose of 'enumeration' in penetration testing?",
        options: ["Counting the number of systems", "Gathering detailed information about targets", "Removing traces of intrusion", "Creating exploit code"],
        correct: 1
    },
    {
        question: "Which of these is NOT a type of malware?",
        options: ["Trojan", "Worm", "Firewall", "Ransomware"],
        correct: 2
    },
    {
        question: "What does the '-sS' flag do in Nmap?",
        options: ["Full TCP connect scan", "SYN stealth scan", "UDP scan", "Service version detection"],
        correct: 1
    },
    {
        question: "Which encoding is commonly used to obfuscate payloads?",
        options: ["ASCII", "Base64", "UTF-8", "Binary"],
        correct: 1
    },
    {
        question: "What is 'social engineering'?",
        options: ["Writing code for social media", "Manipulating people into divulging confidential information", "Building social networks", "Engineering software for collaboration"],
        correct: 1
    },
    {
        question: "Which file on Linux systems contains user password hashes?",
        options: ["/etc/passwd", "/etc/shadow", "/etc/hosts", "/etc/group"],
        correct: 1
    },
    {
        question: "What is the purpose of a WAF?",
        options: ["Wireless Access Facility", "Web Application Firewall", "Wide Area Filter", "Windows Authentication Framework"],
        correct: 1
    },
    {
        question: "Which tool is used for intercepting and modifying web traffic?",
        options: ["Nmap", "Burp Suite", "Aircrack-ng", "Hydra"],
        correct: 1
    },
    {
        question: "What does 'RCE' stand for?",
        options: ["Remote Code Execution", "Recursive Command Entry", "Reverse Connection Encryption", "Runtime Component Error"],
        correct: 0
    },
    {
        question: "Which technique is used to discover hidden directories on a web server?",
        options: ["Port scanning", "Directory brute-forcing", "Packet sniffing", "DNS enumeration"],
        correct: 1
    },
    {
        question: "What is the OWASP Top 10?",
        options: ["Top 10 security tools", "Top 10 hackers", "Top 10 web application security risks", "Top 10 ports to scan"],
        correct: 2
    },
    {
        question: "Which protocol operates on port 53?",
        options: ["HTTP", "FTP", "DNS", "SMTP"],
        correct: 2
    },
    {
        question: "What is a 'buffer overflow'?",
        options: ["Too much data in a database", "Writing more data to a buffer than it can hold", "Network congestion", "Memory leak"],
        correct: 1
    },
    {
        question: "Which tool is used for wireless network attacks?",
        options: ["SQLmap", "Aircrack-ng", "Nikto", "Gobuster"],
        correct: 1
    },
    {
        question: "What is 'pivoting' in penetration testing?",
        options: ["Rotating through targets", "Using a compromised system to attack other systems", "Changing attack vectors", "Reversing exploits"],
        correct: 1
    },
    {
        question: "Which header can help prevent XSS attacks?",
        options: ["Access-Control-Allow-Origin", "Content-Security-Policy", "X-Frame-Options", "Strict-Transport-Security"],
        correct: 1
    },
    {
        question: "What is the purpose of 'netcat'?",
        options: ["Network packet capture", "Network utility for reading/writing network connections", "Network address translation", "Network configuration"],
        correct: 1
    },
    {
        question: "Which attack involves overwhelming a system with traffic?",
        options: ["SQL Injection", "DDoS", "Phishing", "Man-in-the-Middle"],
        correct: 1
    },
    {
        question: "What does 'MITM' stand for?",
        options: ["Module In The Middle", "Man-In-The-Middle", "Message Integrity Through Monitoring", "Multiple Input Transaction Manager"],
        correct: 1
    },
    {
        question: "Which command is used to view network connections on Linux?",
        options: ["ifconfig", "netstat", "ping", "traceroute"],
        correct: 1
    },
    {
        question: "What is 'shellcode'?",
        options: ["Code that creates a shell interface", "Small piece of code used as payload in exploitation", "Shell script", "Command line code"],
        correct: 1
    },
    {
        question: "Which tool automates SQL injection attacks?",
        options: ["Nmap", "SQLmap", "Hydra", "Nikto"],
        correct: 1
    },
    {
        question: "What is 'footprinting' in ethical hacking?",
        options: ["Leaving traces behind", "Collecting preliminary information about a target", "Creating fake digital footprints", "Tracking user behavior"],
        correct: 1
    },
    {
        question: "Which protocol is vulnerable to packet sniffing?",
        options: ["HTTPS", "SSH", "HTTP", "SFTP"],
        correct: 2
    },
    {
        question: "What is a 'honeypot'?",
        options: ["A type of malware", "A decoy system to attract attackers", "A password storage", "An encryption method"],
        correct: 1
    },
    {
        question: "Which file contains DNS information on Linux?",
        options: ["/etc/hosts", "/etc/resolv.conf", "/etc/network", "/etc/dns"],
        correct: 1
    },
    {
        question: "What is 'ARP spoofing'?",
        options: ["Attacking wireless networks", "Sending fake ARP messages to redirect traffic", "Spoofing email addresses", "Faking IP addresses"],
        correct: 1
    },
    {
        question: "Which technique tests how an application handles unexpected inputs?",
        options: ["Penetration testing", "Fuzzing", "Social engineering", "Phishing"],
        correct: 1
    },
    {
        question: "What does the '/etc/passwd' file contain on Unix systems?",
        options: ["Encrypted passwords", "User account information", "System configurations", "Network settings"],
        correct: 1
    },
    {
        question: "Which tool is used for subdomain enumeration?",
        options: ["Metasploit", "Sublist3r", "Wireshark", "John the Ripper"],
        correct: 1
    },
    {
        question: "What is 'lateral movement'?",
        options: ["Moving files between systems", "Moving through a network after initial compromise", "Physical relocation of servers", "Horizontal scaling"],
        correct: 1
    },
    {
        question: "Which protocol provides secure file transfer?",
        options: ["FTP", "HTTP", "SFTP", "Telnet"],
        correct: 2
    },
    {
        question: "What is a 'rootkit'?",
        options: ["A root password cracker", "Malware designed to hide its presence", "A Linux installation tool", "A network router kit"],
        correct: 1
    },
    {
        question: "Which Nmap flag performs OS detection?",
        options: ["-sV", "-O", "-A", "-sS"],
        correct: 1
    },
    {
        question: "What is 'credential stuffing'?",
        options: ["Filling forms with fake data", "Using stolen credentials on multiple sites", "Encrypting passwords", "Generating random passwords"],
        correct: 1
    },
    {
        question: "Which port does FTP use for data transfer?",
        options: ["20", "21", "22", "23"],
        correct: 0
    },
    {
        question: "What is a 'bind shell'?",
        options: ["A shell that binds to a port and listens for connections", "Encrypted shell", "Shell script binding", "Multiple shells combined"],
        correct: 0
    },
    {
        question: "Which vulnerability class involves improper validation of array indices?",
        options: ["SQL Injection", "Buffer Overflow", "Cross-Site Scripting", "Directory Traversal"],
        correct: 1
    },
    {
        question: "What does 'SUID' stand for in Linux permissions?",
        options: ["Super User ID", "Set User ID", "Secure User Interface Design", "System Universal ID"],
        correct: 1
    },
    {
        question: "Which tool is used for brute-forcing login credentials?",
        options: ["Nmap", "Hydra", "Wireshark", "tcpdump"],
        correct: 1
    },
    {
        question: "What is 'pass-the-hash'?",
        options: ["Cracking password hashes", "Using a hash directly for authentication without cracking", "Sharing passwords", "Hashing algorithm"],
        correct: 1
    },
    {
        question: "Which technique involves injecting malicious code into running processes?",
        options: ["SQL Injection", "Process Injection", "XSS", "CSRF"],
        correct: 1
    },
    {
        question: "What is the purpose of 'recon-ng'?",
        options: ["Network reconnaissance", "Password recovery", "Packet analysis", "Exploit development"],
        correct: 0
    },
    {
        question: "Which type of scan is least likely to be detected by IDS?",
        options: ["TCP Connect Scan", "SYN Scan", "NULL Scan", "XMAS Scan"],
        correct: 2
    },
    {
        question: "What is 'pharming'?",
        options: ["Farming data centers", "Redirecting users to fake websites via DNS poisoning", "Phishing via email", "Farming cryptocurrencies"],
        correct: 1
    }
];
