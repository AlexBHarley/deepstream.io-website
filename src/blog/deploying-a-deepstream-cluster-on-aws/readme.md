Deploying a realtime cluster on Amazon Web Services

Intro realtime

challenges

setup

sudo yum install nginx

screen -S dsmain deepstream start

# install gcc (needed to compile nginx)
sudo yum update
sudo yum install gcc -y

# download and unzip nginx stable version (check for latest version number before using)
wget http://nginx.org/download/nginx-1.10.1.tar.gz
tar zxf nginx-1.10.1.tar.gz
cd nginx-1.10.1

# enable stream, disable unneeded http modules that require additional dependencies
./configure --with-stream --without-http_rewrite_module --without-http_gzip_module

# build and install
make
sudo make install


worker_processes  1;

error_log /usr/local/nginx/logs/error.log info;

events {
    worker_connections  1024;
}

stream {
    # define all http/ws endpoints
    upstream browserendpoint {
        server localhost:6020; #add more as required
    }

    server {
        listen 620 tcp; #external browser port
        proxy_pass browserendpoint;
    }
}

[ec2-user@ip-172-31-18-76 nginx-1.10.1]$ sudo touch /usr/local/nginx/logs/error.log
[ec2-user@ip-172-31-18-76 nginx-1.10.1]$ vim conf/nginx.conf
[ec2-user@ip-172-31-18-76 nginx-1.10.1]$ sudo /usr/local/nginx/sbin/nginx -c ~/nginx/nginx-1.10.1/conf/nginx.conf


To learn how to use load balancing and SSL with Nginx visit https://deepstream.io/tutorials/integrations/other-nginx/