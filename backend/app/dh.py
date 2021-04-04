import random
import hashlib
import sys

# Function to generate the shared prime number and primitive root
def generateSharedPrimeRoot(prime_limit = 100):
    random_list_of_primes = generateListOfPrimes(prime_limit)
    publicPrime = random_list_of_primes[random.randint(0,len(random_list_of_primes)-1)]
    publicRoot = findFirstPrimitiveRoot(publicPrime)
    return publicPrime, publicRoot

# Function to generate a private key (random int between 1 and a defined limit)
def generatePrivateKey(upper_limit = 1000000):
    return random.randint(1,upper_limit)

# Function to generate a public key to pass
def generatePublicKey(private_key,shared_prime, shared_root):
    return (shared_root**private_key) % shared_prime
    
# Function to generate your shared password using their public key, your private key, and the shared prime
def generateSharedPassword(their_public_key, your_private_key, shared_prime):
    shared_secret = (their_public_key**your_private_key) % shared_prime
    return hashlib.sha256(str(shared_secret).encode()).hexdigest()

# Helper function that finds the first primitive root of a prime number
def findFirstPrimitiveRoot(prime):
    num_to_check = 0
    p_minus_1_range = range(1,prime)
    primitive_roots = []
    for each in range(1, prime):
    	num_to_check += 1
    	candidate_prim_roots = []
    	for i in range(1, prime):
    		modulus = (num_to_check ** i) % prime
    		candidate_prim_roots.append(modulus)
    		cleanedup_candidate_prim_roots = set(candidate_prim_roots)
    		if len(cleanedup_candidate_prim_roots) == len(range(1,prime)):
    			return num_to_check

# Helper function that generates a list of prime numbers up to a certain upper limit
def generateListOfPrimes(upper_limit = 1000):
    return list(filter(isPrime, range(1, upper_limit)))

# Helper function to determine if numbers are primes
def isPrime(num):
    if num == 0 or num == 1:
        return False
    for x in range(2, num):
        if num % x == 0:
            return False
    else:
        return True

# TEST
shared_prime, shared_root = generateSharedPrimeRoot()
print('Shared Prime Number: ', shared_prime)
print('Shared Primitive Root: ', shared_root)

private_key_A = generatePrivateKey(1000000)
private_key_B = generatePrivateKey(1000000)
print('Private Key A: ', private_key_A)
print('Private Key B: ', private_key_B)

public_key_A = generatePublicKey(private_key_A,shared_prime,shared_root)
public_key_B = generatePublicKey(private_key_B,shared_prime,shared_root)
print('Public Key A: ', public_key_A)
print('Public Key B: ', public_key_B)

shared_password_A = generateSharedPassword(public_key_B,private_key_A,shared_prime)
shared_password_B = generateSharedPassword(public_key_A,private_key_B,shared_prime)
print('Shared Password for A:', shared_password_A)
print('Shared Password for B:', shared_password_B)