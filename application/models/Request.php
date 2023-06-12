<?php

class Request extends CI_Model
{
    function __construct()
    {
        parent::__construct();
        $this->uploadTypes = array(
            'doc'    => ['allowed_types' => 'pdf|docx|doc|txt'],
            'all'    => ['allowed_types' => '*'],
            'img'    => ['allowed_types' => 'jpg|jpeg|png|jpg'],
            'html'   => ['allowed_types' => 'html'],
            'custom' => ['allowed_types' => 'pdf|doc|docx|xls|xlsx|jpg|jpeg|png|ppt|pptx']
        );

        $this->key = "ItL6s86zJjMvHagS";
    }

    public function getKey()
    {
        return $this->key;
    }

    function id($id)
    {
        return array('md5(id)' => $id);
    }

    function encKey($key)
    {
        return "md5($key)";
    }

    function acak($text)
    {
        return md5($text);
    }

    function cekPerubahan()
    {
        if ($this->db->affected_rows() > 0) {
            return true;
        } else {
            return false;
        }
    }
    
    public function flash()
    {
         if ($this->session->flashdata('warning')) {
            echo '<div class="alert alert-warning">';
            echo $this->session->flashdata('warning');
            echo '</div>';
        }

        if ($this->session->flashdata('success')) {
            echo '<div class="alert alert-success">';
            echo $this->session->flashdata('success');
            echo '</div>';
        }

        if ($this->session->flashdata('error')) {
            echo '<div class="alert alert-danger">';
            echo $this->session->flashdata('error');
            echo '</div>';
        }
    }


    function print($array, $clear = true, $stop = true)
    {
        if ($clear == true) {
            ob_clean();
            echo "<pre>";
            echo print_r($array);
            echo "</pre>";
            exit(0);
        } else {
            echo "<pre>";
            echo print_r($array);
            echo "</pre>";
            if ($stop == true) {
                exit(0);
            }
        }
    }

    function session()
    {
        $this->print($_SESSION);
    }

    function json($array)
    {
        echo "<pre>";
        echo json_encode($array);
        echo "</pre>";
    }

    function query()
    {
        echo $this->db->last_query();
    }

    function input($input)
    {
        return htmlspecialchars(ltrim(rtrim($_POST[$input])));
    }

    function all($guarded = null)
    {
        $request = $_POST;
        foreach ($request as $key => $value) {
            $result[$key] = $this->input($key);
        }
        if ($guarded != null) {
            foreach ($guarded as $guard_ => $value) {
                if ($value == false) {
                    unset($request[$guard_]);
                } else {
                    unset($request[$guard_]);
                    $request[$guard_] = $value;
                }
            }
        }
        return $request;
    }


    function upload($data)
    {
        $maxSize = isset($data['max_size']) ? $data['max_size'] : 5024;
        $config = array(
            'upload_max_filesize ' => $maxSize,
            'upload_path' => $data['path'],
            'encrypt_name' => $data['encrypt'],
            'max_size' => $maxSize
        );
        $config = array_merge($config, $this->uploadTypes[$data['type']]);
        $this->load->library('upload', $config);
        $uploading = $this->upload->do_upload($data['file']) ? true : false;
        if (!$uploading) {
            return array(
                'message' => 'error',
                'data' => $this->upload->display_errors()
            );
        } else {
            return array(
                'message' => 'success',
                'data' => $this->upload->data()
            );
        }
    }

    function upload_form($data)
    {
    
        $encrypt = (isset($data['encrypt']) == true) ? true : false;
        $fileName = (isset($data['fileName']) != '') ? $data['fileName'] : null;
        $customInput = (isset($data['customInput']) != '') ? $data['customInput'] : null;
        $maxSize = isset($data['max_size']) ? $data['max_size'] : 3500;
        
        if ($fileName) {
            $config = array(
                'upload_path' => './uploads/' . $data['path'],
                'file_name' => $data['fileName'],
                'max_size' => $maxSize
            );
        } else {
            $config = array(
                'upload_path' => './uploads/' . $data['path'],
                'encrypt_name' => $encrypt,
                'max_size' => $maxSize
            );
        }

        $config = array_merge($config, $this->uploadTypes[$data['type']]);
        $this->load->library('upload', $config);
        $uploading = $this->upload->do_upload($data['file']) ? true : false;
        if (!$uploading) {
            return $data_ = $this->all($customInput);
        } else {
            $data_ = $this->all($customInput);
            $upload_data = $this->upload->data();
            $result = array_merge($data_, [$data['file'] => $upload_data['file_name']]);
            // print_r($result);
            return $result;
        }
    }

    function upload_form_multi($data)
    {
        $fileName = [];
        // $this->print($data);
        $countfiles = count($_FILES[$data['file']]['name']);
        $maxSize = isset($data['max_size']) ? $data['max_size'] : 3500;
        $success = 0;

        if ($data['encrypt'] == true) {
            $config_ = array(
                'upload_path' => './uploads/' . $data['path'],
                'encrypt_name' => true,
                'max_size' => $maxSize
            );
        } else {
            $config_ = array(
                'upload_path' => './uploads/' . $data['path'],
                'encrypt_name' => false,
                'max_size' => $maxSize
            );
        }

        // echo $fileNameNa;

        $config = array_merge($config_, $this->uploadTypes[$data['type']]);

        $this->load->library('upload', $config);

        for ($i = 0; $i < $countfiles; $i++) {
            if (!empty($_FILES[$data['file']]['name'][$i])) {
                // echo $_FILES[$data['file']]['name'][$i];
                $fileNameNa = str_replace(["'", "`", ";", "^"], "", $_FILES[$data['file']]['name'][$i]);

                $_FILES['file']['name'] = $fileNameNa;
                $_FILES['file']['type'] = $_FILES[$data['file']]['type'][$i];
                $_FILES['file']['tmp_name'] = $_FILES[$data['file']]['tmp_name'][$i];
                $_FILES['file']['error'] = $_FILES[$data['file']]['error'][$i];
                $_FILES['file']['size'] = $_FILES[$data['file']]['size'][$i];

                $config['file_name'] = time() . "-" . $fileNameNa;

                $this->upload->initialize($config);

                // File upload
                $uploading = $this->upload->do_upload('file') ? true : false;

                if ($uploading) {
                    // Get data about the file
                    $success++;
                    $uploadData = $this->upload->data();
                    $fileName[] = $uploadData['file_name'];
                    $oriFile[] = $fileNameNa;
                } else {
                    return $this->upload->display_errors();
                }
            }
        }

        $fileNaGan = "";
        foreach ($fileName as $key) {
            $fileNaGan .= "$key,";
        }

        $fileOriNaGan = "";
        foreach ($oriFile as $key) {
            $fileOriNaGan .= "$key,";
        }

        $fileNaGan = substr($fileNaGan, 0, strlen($fileNaGan) - 1);
        $fileOriNaGan = substr($fileOriNaGan, 0, strlen($fileOriNaGan) - 1);
        // print_r($fileName);
        $custom = isset($data['customInput']) ? $data['customInput'] : null;
        return [
            'total' => $countfiles,
            'success' => $success,
            'data' => $this->all($custom),
            'file' => [
                'lampiran' => $fileNaGan,
                'oriFile'  => $fileOriNaGan
            ]
        ];
    }


    function dateIndo($tanggal)
    {
        $bulan = array(
            1 =>   'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember'
        );
        $pecahkan = explode('-', $tanggal);

        return $pecahkan[2] . ' ' . $bulan[(int)$pecahkan[1]] . ' ' . $pecahkan[0];
    }

    function getBulan($bul)
    {
        // $bul = date('n');

        switch ($bul) {
            case 1:
                $bulan = "Januari";
                break;
            case 2:
                $bulan = "Febuari";
                break;
            case 3:
                $bulan = "Maret";
                break;
            case 4:
                $bulan = "April";
                break;
            case 5:
                $bulan = "Mei";
                break;
            case 6:
                $bulan = "Juni";
                break;
            case 7:
                $bulan = "Juli";
                break;
            case 8:
                $bulan = "Agustus";
                break;
            case 9:
                $bulan = "September";
                break;
            case 10:
                $bulan = "Oktober";
                break;
            case 11:
                $bulan = "November";
                break;
            case 12:
                $bulan = "Desember";
                break;
        }
        return $bulan;
    }

    public function getHari($hari)
    {
        // $hari = date("D");

        switch ($hari) {
            case 'Sun':
                $hari_ini = "Minggu";
                break;

            case 'Mon':
                $hari_ini = "Senin";
                break;

            case 'Tue':
                $hari_ini = "Selasa";
                break;

            case 'Wed':
                $hari_ini = "Rabu";
                break;

            case 'Thu':
                $hari_ini = "Kamis";
                break;

            case 'Fri':
                $hari_ini = "Jumat";
                break;

            case 'Sat':
                $hari_ini = "Sabtu";
                break;

            default:
                $hari_ini = "";
                break;
        }

        return $hari_ini;
    }

    public function secretKey()
    {
        $key = "helloWorld";
        return $key;
    }

    function rupiah($angka)
    {
        $hasil_rupiah = "Rp " . number_format($angka, 0, ',', '.');
        return $hasil_rupiah;
    }

    
    function set_cookies_login($data){
        $ck='';
        foreach($data as $k => $v)
            $ck.=$k.'dangi'.$v.'danga';
        setcookie('dsikand',$this->encr($ck), time()+86400*30, '/');
    }

    function get_char(){
        return implode('',array_merge(range('a','z'),range(0,9),range('A','Z')));
    }

    function key_($i){
        $bc=array(
            '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'
    );
    
    if($i<62&&$i>=0)
        return $bc[$i];
    else
        return end($bc);
    }

    function ch($v,$k){
        $ada=false;
        $j=0;
        while(!$ada&&$j<62){
            $ada=$v==$k[$j];
            if(!$ada)$j++;
        }
        return $j;
    }

    // Belum dapat decryp tanda spesial seperti titik (.)
    function encr($v,$lq=false){
        $res='';
        $p=rand(0,61);
        $l=rand(0,61);
        $k=$this->key_($l);
        for($i=0;$i<strlen($v);$i++){
            $j=$this->ch($v[$i],$k);
            $j=($j+$p+$i)%62;
            $res.=$k[$j];
        }
        $res=$k[$p].$res;
        $k=$this->get_char();
        return $k[$l].$res;
    }

    function decr($v,$l=false){
        $k=$this->get_char();
        $j=$this->ch($v[0],$k);
        $k=$this->key_($j);
        $p=$this->ch($v[1],$k);
        $res='';
        for($i=2;$i<strlen($v);$i++){
            $j=$this->ch($v[$i],$k);
            $j=($j-$p-$i+2+(62*10000))%62;
            $res.=$k[$j];
        }
        return $res;
    }
    // End Ecrpyt text

    function enc_apath($p){
        $dir=str_replace('/','999999',
        str_replace('.','999998',
        str_replace('-','999997',
        str_replace('_','999996',
        $p))));
        return $this->encr($dir);
    }
    function dec_apath($p){
        $dir=str_replace('999999','/',
        str_replace('999998','.',
        str_replace('999997','-',
        str_replace('999996','_',
        $this->decr($p)))));
        return $dir;
    }
    function enc_int($v,$l=50,$s='a'){
        $o=strlen($v);
        if($o<10) $v='0'.$o.$v;
        else $v=$o.$v;
        for($i=0;$i<$l-$o;$i++)
        $v.=$s;
        return $this->encr($v);
    }
    function dec_int($res,$s='a'){
        $res=$this->decr($res);
        $o=substr($res,0,2);
        $sf=str_replace($s,'',substr($res,$o+2));
        if($sf=='')
            return (int)substr($res,2,$o);
        else return false;
    }

    function http_request($data)
    {

        $url = $this->url->url_api();
        $curlna = curl_init();
        curl_setopt_array($curlna, array(
            CURLOPT_URL             => $url,
            CURLOPT_POST            => 1,
            CURLOPT_POSTFIELDS      => $data,
            CURLOPT_RETURNTRANSFER  => 1,
            CURLOPT_HEADER          => false,
        ));

        $response = curl_exec($curlna);
        $respon = utf8_encode($response);
        $token = json_decode($respon, true);

        $info = curl_getinfo($curlna);

        return $token;
    }

    public function enc64($value)
    {
        return base64_encode(base64_encode($value));
    }

    public function dec64($value)
    {
        return base64_decode(base64_decode($value));
    }


    function get_token()
    {
        
        if ($_SESSION['logged_in'] == "1") {
            $data = array(
                'act' => 'GetToken',
                'username' => $_SESSION['username'],
                'password' => $this->req->dec64($_SESSION['key']),
            );
        }else{
            $data = array(
                'act' => 'GetToken',
                'username' => $user = $this->input->post('username'),
                'password' =>  $pass = $this->input->post('password'),
            );
        }
        $res = $this->run($data);

        if ($res[0]) {
            if ($res[1]['error_code'] == 0) {
                // return $res[1]['data']['token'];
                $message = array(
                    'status' => "success",
                    'pesan' => $res[1]['data']['token'],
                    'token' => $res[1]['data']['token'],
                );
            } else {
                $message = array(
                    'status' => "fail",
                    'pesan' => $res[1]['error_desc'],
                );
            }
            return $message;
        }
    }

    public function run1($data = array())
    {
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => "http://localhost:8100/ws/live2.php",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_HTTPHEADER => array(
                "cache-control: no-cache"
            ),
        ));
        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);
        if ($err) {
            echo "cURL Error #:" . $err;
        } else {
            echo $response;
        }

        $this->req->print($response);
    }

    public function getToken()
    {
        $data = array(
            'act' => 'GetToken',
            'username' => $this->user,
            'password' => $this->password,
            'id_smt' => "20202",
        );
        $res = $this->run($data);
        if ($res[0]) {
            if ($res[1]['error_code'] == 0) {
                return $res[1]['data']['token'];
            } else {
                echo "Get token failed: " . $res[1]['error_desc'];
                die;
            }
        }
    }

    public function getNewToken()
    {
        if (!isset($_SESSION['username'])) {
            return false;
        }else{
            $data = array(
                'act' => 'GetToken',
                'username' => $_SESSION['username'],
                'password' => $this->req->dec_string($_SESSION['path']),
            );

            $res = $this->runToken($data);

            if ($res[0]) {
                if ($res[1]['error_code'] == 0) {
                    $token = $res[1]['data']['token'];
                    $session = array('token' => $token);
                    $this->session->set_userdata($session);
                    return $res[1]['data']['token'];
                } else {
                    echo "Get token failed: " . $res[1]['error_desc'];
                    die;
                }
            }
        }
        
    }

    function runToken($data = array())
    {

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_POST, 1);
        $headers[] = 'Content-Type: application/json';

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        if ($data) {
            $data = json_encode($data);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        }
        curl_setopt($ch, CURLOPT_URL, $this->url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $result = curl_exec($ch);
        curl_close($ch);

        if ($result) {
            $res = array(true, json_decode($result, true));
        } else {
            echo "CURL ERROR\n";
            die;
        }

        return $res;
    }

    function run($data)
    {
        // echo "jon";
        $ch = curl_init();

        // Set opsi cURL
        curl_setopt($ch, CURLOPT_URL, $this->url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));

        // Eksekusi cURL dan simpan responsenya
        $response = curl_exec($ch);

        // Tutup koneksi cURL
        curl_close($ch);

        // $this->req->print($response);
        // return $response;
        // Tampilkan respons dari server
        return json_decode($response);

    }

    public function request_post($data)
    {
        $url = $this->pmb;
        // $this->req->print($data);
        ?>
            <script type="text/javascript">
                function closethisasap() {
                    document.forms["redirectpost"].submit();
                }
            </script>
            
            <body onload="closethisasap();">
                <form name="redirectpost" id='red' method="post" action="<?= $url; ?>">
                    <?php if (!is_null($data) ) {
                        foreach ($data as $k => $v) {
                            echo '<input type="hidden" name="' . $k . '" value="' . $v . '"> ';
                        }
                    } ?>
                </form>
            </body>
        <?php
        exit;


        // return $url;
    
    }

    public function request_post_regist($data)
    {
        $url = $this->pmb;
        // $this->req->print($data);
        ?>
            <script type="text/javascript">
                // function closethisasap() {
                //     document.forms["redirectpost"].submit();
                // }
            </script>
            <body onload="closethisasap();">
                <form name="redirectpost" target='_top' id='red' method="post" action="<?= $url; ?>">
                    <?php if (!is_null($data) ) {
                        foreach ($data as $k => $v) {
                            echo '<input type="hidden" name="' . $k . '" value="' . $v . '"> ';
                        }
                    } ?>
                </form>
            </body>
        <?php
        exit;


        // return $url;
    
    }

    public function request_get($data = NULL)
    {
        // $url = $this->get . $data;



        // if ($data['act'] = "update") {
            // $url = $this->get . $data['request'];
        // }else{
            $url = $this->get . $data['act']; // the URL of the API endpoint
        // }
        
        // $this->req->print($url);
        // $url = "https://pmb2.unisa-bandung.ac.id/updatedata?cekakun=agastypandu@gmail.com&pass=25d55ad283aa400af464c76d713c07ad1";
        



        // initialize a new cURL session
        $curl = curl_init();

        // set the cURL options
        curl_setopt($curl, CURLOPT_URL, $url); // set the URL
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true); // return the response as a string
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

        // execute the cURL request and get the response
        $response = curl_exec($curl);

        // var_dump($response);
        // die();

        // check for errors
        if ($response === false) {
            $error = curl_error($curl);
            // echo 'cURL error: ' . $error;
        } else {
            // do something with the response
            // echo $response;
        }

        // $this->req->print($response);

        // close the cURL session
        curl_close($curl);

        // echo "boy";

        return $response;


    }

    function run_pmb($data)
    {

        $ch = curl_init();

        // Set opsi cURL
        curl_setopt($ch, CURLOPT_URL, $this->pmb);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));

        // Eksekusi cURL dan simpan responsenya
        $response = curl_exec($ch);

        // Tutup koneksi cURL
        curl_close($ch);

        $this->req->print($response);

        // file_get_contents($response, true);

        // Tampilkan respons dari server
        // return json_decode($response);

    }


        function remove_code(&$string)
        {
            $cari_huruf = array("'", '&amp;', '&copy;', '&crarr;', '&dArr;', '&deg;', '&divide;', '&eacute;', '&fnof;', '&frasl;', '&ge;', '&harr;', '&hArr;', '&hellip;', '&larr;', '&lArr;', '&ldquo;', '&le;', '&lowast;', '&lsquo;', '&mdash;', '&nbsp;', '&ndash;', '&ne;', '&plusmn;', '&prime;', '&Prime;', '&quot;', '&rarr;', '&rArr;', '&rdquo;', '&reg;', '&rsquo;', '&sect;', '&sum;', '&times;', '&uarr;', '&uArr;', '&lt;br /&gt;', '&lt;', '&gt;', '%', '&check;', '&raquo;', '&laquo;', "'");
            $huruf_baru = array("", '&', '©', '?', '?', '°', '÷', 'é', 'ƒ', '?', '?', '?', '?', '…', '?', '?', '“', '?', '?', '', '', '', '-', '?', '±', '?', '?', '"', '?', '?', '', '®', '', '§', '?', '×', '?', '?', '', '<', '>', "", "✓", ">>", "<<", "");
            return ucwords(strtoupper(str_ireplace($cari_huruf, $huruf_baru, $string)));
        }

        
        function enc_string($p){
            $dir=
                str_replace('/','004349',
                str_replace('.','105359',
                str_replace('-','206369',
                str_replace('_','307469',
                str_replace(' ','408419',
                str_replace('&','509429',
                str_replace('@','601449',
                str_replace('=','715429',
                str_replace('+','815429',
                str_replace('[','915329',
                str_replace(']','015578',
                str_replace('{','115418',
                str_replace('}','216428',
                str_replace('?','317618',
                str_replace('*','416618',
                str_replace('!','519628',
                str_replace(':','611368',
                str_replace('\\','724248',
                str_replace(',','825458',
                str_replace(' ','926138',
                str_replace('`','023718',
                str_replace('~','124558',
                str_replace('#','225458',
                str_replace('$','326258',
                str_replace('%','427728',
                str_replace('^','528538',
                str_replace('(','629548',
                str_replace(')','734238',
                str_replace(';','835428',
                str_replace('"','936678',
                str_replace('<','033817',
                str_replace('>','134667',
                str_replace('|','276443',
                str_replace('\'','784852',
            $p))))))))))))))))))))))))))))))))));
            return $this->encr($dir);
        }

        function dec_string($p){
            $dir=
                str_replace('004349','/',
                str_replace('105359','.',
                str_replace('206369','-',
                str_replace('307469','_',
                str_replace('408419',' ',
                str_replace('509429','&',
                str_replace('601449','@',
                str_replace('715429','=',
                str_replace('815429','+',
                str_replace('915329','[',
                str_replace('015578',']',
                str_replace('115418','{',
                str_replace('216428','}',
                str_replace('317618','?',
                str_replace('416618','*',
                str_replace('519628','!',
                str_replace('611368',':',
                str_replace('724248','\\',
                str_replace('825458',',',
                str_replace('926138',' ',
                str_replace('023718','`',
                str_replace('124558','~',
                str_replace('225458','#',
                str_replace('326258','$',
                str_replace('427728','%',
                str_replace('528538','^',
                str_replace('629548','(',
                str_replace('734238',')',
                str_replace('835428',';',
                str_replace('936678','"',
                str_replace('033817','<',
                str_replace('134667','>',
                str_replace('276443','|',
                str_replace('784852','\'',
            $this->decr($p)))))))))))))))))))))))))))))))))));
            return $dir;
        }

    }



