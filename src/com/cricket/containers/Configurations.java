package com.cricket.containers;
 
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
 
@XmlRootElement(name="Configurations")
@XmlAccessorType(XmlAccessType.FIELD)
public class Configurations {

    @XmlElement(name="filename")
    private String filename;

    @XmlElement(name="broadcaster")
    private String broadcaster;

    public String getBroadcaster() {
        return broadcaster;
    }
    public void setBroadcaster(String broadcaster) {
        this.broadcaster = broadcaster;
    }
    public String getFilename() {
        return filename;
    }
    public void setFilename(String filename) {
        this.filename = filename;
    }
}
