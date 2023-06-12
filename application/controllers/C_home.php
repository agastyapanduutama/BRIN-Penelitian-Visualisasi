<?php 



defined('BASEPATH') OR exit('No direct script access allowed');

class C_home extends CI_Controller {

    
    public function __construct()
    {
        parent::__construct();
        $this->load->model('M_home', 'home');
        
    }
    

    public function index()
    {
        $lokasi = $this->home->getLokasi();
        // $this->req->print($lokasi);

        $data = [
            'lokasi' => $lokasi,
            'title'  => "Visualisasi",
            // 'utama' => $utama,
            // 'lokasi' => $markerna,
        ];

        // $this->req->print($data);

        $this->load->view('v_home', $data, FALSE);
        
    }

}

/* End of file C_home.php */
