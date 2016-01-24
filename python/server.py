import paramiko
import re

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("10.225.8.187",22,"root", "root")
stdin, stdout, stderr = ssh.exec_command("ps -ef|grep was|grep MCT -i|cut -d ' ' -f 1")
pro = stdout.readlines()
print len(pro[0].toString())
ssh.close()
