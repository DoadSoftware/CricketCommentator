package com.cricket.containers;

import java.io.PrintWriter;

public class Scene {
	
	private String scene_path;

	public Scene() {
		super();
	}

	public Scene(String scene_path) {
		super();
		this.scene_path = scene_path;
	}
	
	public String getScene_path() {
		return scene_path;
	}

	public void setScene_path(String scene_path) {
		this.scene_path = scene_path;
	}
	
	public void scene_load(PrintWriter print_writer)
	{
		print_writer.println("-1 RENDERER SET_OBJECT SCENE*" + scene_path + "\0");
		print_writer.println("-1 RENDERER INITIALIZE \0");
		print_writer.println("-1 RENDERER*SCENE_DATA INITIALIZE \0");
		print_writer.println("-1 RENDERER*UPDATE SET 1");
	}
}
