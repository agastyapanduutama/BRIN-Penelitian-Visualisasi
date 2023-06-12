<?php


defined('BASEPATH') OR exit('No direct script access allowed');

class C_feeder extends CI_Controller {

    public function index()
    {
        
    }

    public function feed()
    {
        $lokasi = [
            "-6.830793968677474, 107.63642115868387",
            "-6.831028334507508, 107.6396827240343",
            "-6.830740706311021, 107.6413778851389",
            "-6.831614232559284, 107.64356656378726",
            "-6.831486401232991, 107.64707489106507",
            "-6.832583625184665, 107.64932794830679",
            "-6.835321343363097, 107.65145225772262",
            "-6.836077674412157, 107.65549703159654",
        ];

        // $datalok = explode(',',$lokasi);

        // $this->req->print($lokasi);

        $no=1;
        foreach ($lokasi as $lo) {
            // var_dump($lo);
            $data = array(
                // 'is_first_point' => 1 ,
                'nama_marker' => "Lokasi " . $no++,
                'location' => $lo, 
            );
            $this->db->insert('t_marker_end', $data);
            

        }

    }


    public function insertAPI()
    {
        $kode = $_POST['kode_marker'];
        $getMarkerEnd = $this->db->get_where('t_marker_end', ['kode_marker' => $kode, 'status' => 1])->row_array();

        if (!empty($getMarkerEnd)) {
            // Get Data From POINT
            $point = $this->db->get_where('t_point', ['id_marker_end' => $getMarkerEnd['id']])->row();

            if (!empty($point)) {
                // Update Marker old to zero
                $this->db->update('t_marker_end', ['status' => 0], ['kode_marker' => $kode]);

                // Insert New Location Marker
                $data = array(
                    'kode_marker' => $_POST['kode_marker'],
                    'nama_marker' => $_POST['nama_marker'],
                    'location' => $_POST['location'],
                );

                $this->db->insert('t_marker_end', $data);
                $idakhir = $this->db->insert_id();

                $this->db->update('t_point', ['id_marker_end' => $idakhir], ['id' => $point->id]);

                $msg = [
                    'status' => "ok",
                    'message' => "Berhasil Menambahkan Marker"
                ];
            } else {
                $msg = [
                    'status' => "fail",
                    'message' => "Data not found for id_marker_end: " . $getMarkerEnd['id']
                ];
            }
        } else {
            $msg = [
                    'status' => "fail",
                    'message' => "Kode Marker tidak ada data tidak tersimpan"
                ];
        }

        echo json_encode($msg);


        


    }

}

/* End of file C_feeder.php */
