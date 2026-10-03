/**
 * 90-Day Core CS Syllabus
 * Rotating DBMS, Operating Systems, Computer Networks, and Object-Oriented Programming (OOP)
 */

const CORE_CS_SYLLABUS = [
  // DBMS Phase 1
  { subject: 'DBMS', topic: 'DBMS Fundamentals', details: 'Database Architecture, 3-Schema Architecture, Data Independence, Schema vs Instance' },
  { subject: 'DBMS', topic: 'ER Modeling & Relational Model', details: 'Entities, Attributes, Relationships, Cardinality, ER to Relational Mapping' },
  { subject: 'DBMS', topic: 'Keys & Integrity Constraints', details: 'Primary, Candidate, Super, Foreign, Alternate Keys, Referential Integrity' },
  { subject: 'DBMS', topic: 'Relational Algebra', details: 'Select, Project, Union, Set Difference, Cartesian Product, Natural Join' },
  { subject: 'DBMS', topic: 'SQL Queries & Joins', details: 'INNER, LEFT, RIGHT, FULL OUTER JOIN, Subqueries, Aggregate functions, GROUP BY, HAVING' },
  { subject: 'DBMS', topic: 'Normalization: 1NF, 2NF, 3NF', details: 'Functional Dependencies, Closure sets, Candidate key finding, Lossless Decomposition' },
  { subject: 'DBMS', topic: 'BCNF & Higher Normal Forms', details: 'BCNF verification, Dependency Preservation, 4NF (Multivalued Dependencies)' },
  { subject: 'DBMS', topic: 'Transactions & ACID Properties', details: 'Atomicity, Consistency, Isolation, Durability, Transaction states, Write-Ahead Logging' },
  { subject: 'DBMS', topic: 'Concurrency Control & Serializability', details: 'Conflict vs View Serializability, Precedence Graph, Dirty Read, Unrepeatable Read' },
  { subject: 'DBMS', topic: 'Locking Protocols & Deadlocks', details: '2-Phase Locking (2PL), Strict 2PL, Timestamp Ordering, Deadlock Detection & Prevention' },
  { subject: 'DBMS', topic: 'Indexing & B/B+ Trees', details: 'Dense vs Sparse Index, Primary vs Secondary, Clustered Index, B+ Tree search & insert' },
  
  // OS Phase 1
  { subject: 'Operating Systems', topic: 'OS Fundamentals & System Calls', details: 'Kernel vs User Mode, Dual-mode operation, Trap vs Interrupt, Fork, Exec, Wait' },
  { subject: 'Operating Systems', topic: 'Processes & Process Control Block (PCB)', details: 'Process States, Context Switching, Process Lifecycle, Zombie & Orphan processes' },
  { subject: 'Operating Systems', topic: 'Threads & Concurrency', details: 'User vs Kernel Threads, Multi-threading models, Race Conditions, Critical Section' },
  { subject: 'Operating Systems', topic: 'Process Synchronization', details: 'Peterson\'s Algorithm, Test-and-Set, Semaphores (Binary vs Counting), Mutexes' },
  { subject: 'Operating Systems', topic: 'Classic Synchronization Problems', details: 'Producer-Consumer, Readers-Writers Problem, Dining Philosophers' },
  { subject: 'Operating Systems', topic: 'CPU Scheduling Algorithms', details: 'FCFS, SJF/SRTF, Priority Scheduling, Round Robin, Multilevel Feedback Queue' },
  { subject: 'Operating Systems', topic: 'Deadlocks: Necessary Conditions & Handling', details: 'Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait, Resource Allocation Graph' },
  { subject: 'Operating Systems', topic: 'Banker\'s Algorithm & Deadlock Avoidance', details: 'Safe State vs Unsafe State, Safety Algorithm, Resource Request Algorithm' },
  { subject: 'Operating Systems', topic: 'Memory Management & Contiguous Allocation', details: 'Logical vs Physical Address Space, Fragmentation (Internal vs External), Paging introduction' },
  { subject: 'Operating Systems', topic: 'Paging & TLB', details: 'Page Table structure, Hierarchical Paging, TLB Hit/Miss, Effective Memory Access Time' },
  { subject: 'Operating Systems', topic: 'Virtual Memory & Page Replacement', details: 'Demand Paging, Page Fault Handling, FIFO, LRU, Optimal Page Replacement, Belady\'s Anomaly' },
  { subject: 'Operating Systems', topic: 'Thrashing & File Systems', details: 'Working Set Model, File Allocation (Contiguous, Linked, Indexed), Inodes, Disk Scheduling (SSTF, SCAN, C-SCAN)' },

  // Computer Networks Phase 1
  { subject: 'Computer Networks', topic: 'Network Models: OSI vs TCP/IP', details: 'Functions of each 7 layers, Encapsulation, Decapsulation, PDU across layers' },
  { subject: 'Computer Networks', topic: 'Physical & Data Link Layer', details: 'Framing, Error Detection (Parity, Checksum, CRC), Flow Control (Stop & Wait, Go-Back-N, Selective Repeat)' },
  { subject: 'Computer Networks', topic: 'Medium Access Control (MAC)', details: 'ALOHA (Pure vs Slotted), CSMA, CSMA/CD (Ethernet collision), CSMA/CA, MAC Addressing' },
  { subject: 'Computer Networks', topic: 'Network Layer & IPv4 Addressing', details: 'Classful vs Classless Addressing (CIDR), Subnetting, Supernetting, Subnet Mask calculation' },
  { subject: 'Computer Networks', topic: 'Routing Protocols & Algorithms', details: 'Distance Vector (Bellman-Ford, Count to Infinity), Link State (Dijkstra), OSPF, BGP' },
  { subject: 'Computer Networks', topic: 'ARP, RARP, ICMP, DHCP', details: 'Address Resolution Protocol flow, Gratuitous ARP, Ping & Traceroute mechanisms, DHCP DORA flow' },
  { subject: 'Computer Networks', topic: 'Transport Layer: TCP vs UDP', details: 'Connection-oriented vs Connectionless, Port numbers, Segment structure, Reliability mechanisms' },
  { subject: 'Computer Networks', topic: 'TCP 3-Way Handshake & Teardown', details: 'SYN, SYN-ACK, ACK, FIN flags, Sequence numbers, TIME_WAIT state, RST flag' },
  { subject: 'Computer Networks', topic: 'TCP Flow & Congestion Control', details: 'Sliding Window, Slow Start, Congestion Avoidance, Fast Retransmit, Fast Recovery (AIMD)' },
  { subject: 'Computer Networks', topic: 'Application Layer: DNS & HTTP/HTTPS', details: 'DNS Hierarchy, Recursive vs Iterative resolution, HTTP 1.1 vs HTTP/2 vs HTTP/3, SSL/TLS handshake' },
  { subject: 'Computer Networks', topic: 'Web Protocols: WebSockets, REST, gRPC', details: 'Full duplex sockets, REST constraints, Statelesness, Protocol Buffers, Network Security basics' },

  // OOP Phase 1
  { subject: 'OOP', topic: 'Core OOP Pillars: Encapsulation & Abstraction', details: 'Access Modifiers, Information Hiding, Abstract Classes vs Interfaces' },
  { subject: 'OOP', topic: 'Inheritance & Polymorphism', details: 'Method Overloading vs Overriding, Compile-time vs Runtime polymorphism, Virtual functions' },
  { subject: 'OOP', topic: 'SOLID Principles (S & O)', details: 'Single Responsibility Principle, Open/Closed Principle with practical code examples' },
  { subject: 'OOP', topic: 'SOLID Principles (L, I, D)', details: 'Liskov Substitution, Interface Segregation, Dependency Inversion with real examples' },
  { subject: 'OOP', topic: 'Design Patterns: Creational', details: 'Singleton Pattern (Thread-safe), Factory Method, Abstract Factory, Builder Pattern' },
  { subject: 'OOP', topic: 'Design Patterns: Structural', details: 'Adapter Pattern, Decorator Pattern, Facade Pattern, Proxy Pattern' },
  { subject: 'OOP', topic: 'Design Patterns: Behavioral', details: 'Observer Pattern, Strategy Pattern, Command Pattern, State Pattern' }
];

export const coreCSPlan = Array.from({ length: 90 }, (_, index) => {
  const day = index + 1;
  const rotationIndex = index % CORE_CS_SYLLABUS.length;
  const item = CORE_CS_SYLLABUS[rotationIndex];

  return {
    day,
    subject: item.subject,
    topic: item.topic,
    details: item.details,
    targetMinutes: 30
  };
});
