<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Email extends BaseConfig
{
    public string $fromEmail;
    public string $fromName;
    public string $recipients = '';

    public string $userAgent = 'CodeIgniter';

    public string $protocol;
    public string $mailPath = '/usr/sbin/sendmail';
    public string $SMTPHost;
    public string $SMTPUser;
    public string $SMTPPass;
    public int    $SMTPPort;
    public int    $SMTPTimeout;
    public bool   $SMTPKeepAlive;
    public string $SMTPCrypto;
    public bool   $wordWrap = true;
    public int    $wrapChars = 76;
    public string $mailType;
    public string $charset = 'UTF-8';
    public bool   $validate = false;
    public int    $priority = 3;
    public string $CRLF = "\r\n";
    public string $newline = "\r\n";
    public bool   $BCCBatchMode = false;
    public int    $BCCBatchSize = 200;
    public bool   $DSN = false;

    public function __construct()
    {
        parent::__construct();

        $this->protocol      = getenv('email.protocol') ?: 'smtp';
        $this->SMTPHost      = getenv('email.SMTPHost') ?: 'smtp.gmail.com';
        $this->SMTPUser      = getenv('email.SMTPUser') ?: '';
        $this->SMTPPass      = getenv('email.SMTPPass') ?: '';
        $this->SMTPPort      = (int)(getenv('email.SMTPPort') ?: 465);
        $this->SMTPTimeout   = (int)(getenv('email.SMTPTimeout') ?: 60);
        $this->SMTPKeepAlive = filter_var(getenv('email.SMTPKeepAlive'), FILTER_VALIDATE_BOOLEAN);
        $this->SMTPCrypto    = getenv('email.SMTPCrypto') ?: 'tls';
        $this->mailType      = getenv('email.mailType') ?: 'html';
        $this->fromEmail     = getenv('email.fromEmail') ?: '';
        $this->fromName      = getenv('email.fromName') ?: 'Leave Management System';
    }
}
